import * as React from "react";
import { MgtPeoplePicker, Providers, ProviderState } from "@microsoft/mgt";
import { PeoplePickerProps, wrapMgt } from "@microsoft/mgt-react";
import { customElement } from "lit-element";
import { IGraph, prepScopes, CacheService, CacheStore } from '@microsoft/mgt-element';
import { User } from '@microsoft/microsoft-graph-types';
import { getUsersForUserIds, CacheUserQuery, getIsUsersCacheEnabled, getUserInvalidationTime } from "@microsoft/mgt-components/dist/es6/graph/graph.user";
import { schemas } from "@microsoft/mgt-components/dist/es6/graph/cacheStores";

export const UserPicker = (props: PeoplePickerProps) => {
    const key = JSON.stringify(props.selectedPeople);
    return React.useMemo(
        () => (<PeoplePickerExtended {...props}/>),
        [key] // eslint-disable-line react-hooks/exhaustive-deps
    );
};

@customElement("mgt-people-picker-extended")
class MgtPeoplePickerExtended extends MgtPeoplePicker {
    protected renderLoading() {
        if (!this.userInput) {
            return null as any;
        }
        return super.renderLoading();
    }

    protected renderNoData() {
        if (!this.userInput) {
            return null as any;
        }
        return super.renderNoData();
    }

    protected async loadState() {
        //to access private methods and props
        const self = this as MgtPeoplePicker & any;
        const provider = Providers.globalProvider;
        if (!provider || provider.state === ProviderState.Loading) {
            return;
        }

        if (provider.state === ProviderState.SignedOut) {
            self._foundPeople = null;
            return;
        }

        const graph = provider.graph.forComponent(this);
        if (self.defaultSelectedUserIds && !self.selectedPeople.length && !self.defaultSelectedUsers) {
            self.defaultSelectedUsers = await getUsersForUserIds(graph, self.defaultSelectedUserIds);
            self.selectedPeople = [...self.defaultSelectedUsers];
            self.requestUpdate();
            self.fireCustomEvent("selectionChanged", this.selectedPeople);
        }

        let users: any[] | null = null;
        if (this.userInput) {
            if (this.people?.length) {
                users = this.people.filter((user) => (user?.displayName ? user.displayName.toLowerCase().indexOf(this.userInput.toLowerCase()) !== -1 : false));
                users = users!.filter((user, idx) => users?.findIndex((a) => a.id === user.id) === idx);
            } else {
                users = await this.findUsers(graph, this.userInput, this.showMax || 6);
            }
        }
        self._foundPeople = users?.length ? users : null;
        if (!users?.length) {
            self._showLoading = false;
        }
    }

    private findUsers = async (graph: IGraph, query: string, top: number = 10): Promise<User[]> => {
        const scopes = 'User.ReadBasic.All';
        const item = { maxResults: top, results: undefined };
        let cache: CacheStore<CacheUserQuery> | undefined = undefined;
      
        if (getIsUsersCacheEnabled()) {
          cache = CacheService.getCache<CacheUserQuery>(schemas.users, schemas.users.stores.usersQuery);
          const result: CacheUserQuery = await cache.getValue(query);
      
          if (result && getUserInvalidationTime() > Date.now() - (result.timeCached as any)) {
            return result.results?.map(userStr => JSON.parse(userStr)) || [];
          }
        }
      
        let graphResult;
      
        let encodedQuery = `${query.replace(/#/g, '%2523')}`;
        try {
          graphResult = await graph
            .api('users')
            .header('ConsistencyLevel', 'eventual')
            .count(true)
            .filter(`userType eq 'Member'`)
            .search(`"displayName:${encodedQuery}" OR "mail:${encodedQuery} AND "`)
            .top(top)
            .middlewareOptions(prepScopes(scopes))
            .get();
        } catch {}
      
        if (getIsUsersCacheEnabled() && graphResult && cache) {
          item.results = graphResult.value.map(userStr => JSON.stringify(userStr));
          cache.putValue(query, item);
        }
        return graphResult ? graphResult.value : null;
      }
}

export const PeoplePickerExtended = wrapMgt<PeoplePickerProps>("mgt-people-picker-extended");
