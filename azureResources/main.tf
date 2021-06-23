# Variables: START
variable "resourceGroup" {
  type = map
  default = {
    "name" = "tab-room-check-in-rg"
    "location" = "australiasoutheast"
  }
}

variable "webApp" {
  type = map
  default = {
    "name" = "tab-room-check-in-app"
    "servicePlanName" = "tab-room-check-in-plan"
    "appInsightsName" = "tab-room-check-in-appinsights"
  }
}

variable "keyVault" {
  type = map
  default = {
    "name" = "tab-room-check-in-kv"
    "certificateName" = "tab-room-check-in-certificate"
  }
}

variable "storage" {
  type = map
  default = {
    "accountName" = "tabroomcheckinstorage"
    "userTableName" = "user"
    "eventTableName" = "event"
    "roomTableName" = "room"
    "checkinTableName" = "checkin"
  }
}
# Variables: END

# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = ">= 2.26"
    }
  }
}

data "azurerm_client_config" "current" {}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy = false
    }
  }
}

resource "azurerm_resource_group" "resourceGroup" {
  name     = var.resourceGroup["name"]
  location = var.resourceGroup["location"]
}

resource "azurerm_app_service_plan" "servicePlan" {
    name                = var.webApp["servicePlanName"]
    location            = azurerm_resource_group.resourceGroup.location
    resource_group_name = azurerm_resource_group.resourceGroup.name
    kind                = "linux"
    reserved            = true
    sku {
        tier        = "Free"
        size        = "F1"
    }
}

resource "azurerm_application_insights" "appInsights" {
    name                = var.webApp["appInsightsName"]
    location            = azurerm_resource_group.resourceGroup.location
    resource_group_name = azurerm_resource_group.resourceGroup.name
    application_type    = "web"
}

resource "azurerm_app_service" "webApp" {
    name                = var.webApp["name"]
    location            = azurerm_resource_group.resourceGroup.location
    resource_group_name = azurerm_resource_group.resourceGroup.name
    app_service_plan_id = azurerm_app_service_plan.servicePlan.id
    identity {
        type = "SystemAssigned"
    }
    site_config {
        linux_fx_version            = "NODE|14-lts" 
        min_tls_version             = "1.2"
        scm_type                    = "VSTSRM"
        use_32_bit_worker_process   = true 
        websockets_enabled          = false
    }

    app_settings = {
          "APPINSIGHTS_INSTRUMENTATIONKEY"                  = azurerm_application_insights.appInsights.instrumentation_key
          "APPINSIGHTS_PROFILERFEATURE_VERSION"             = "1.0.0"
          "APPINSIGHTS_SNAPSHOTFEATURE_VERSION"             = "1.0.0"
          "APPLICATIONINSIGHTS_CONNECTION_STRING"           = azurerm_application_insights.appInsights.connection_string
          "AUTH_APP_CERTIFICATE_THUMBPRINT"                 = ""
          "AUTH_APP_CLIENTID"                               = ""
          "AUTH_APP_URI"                                    = ""
          "AUTH_AUTHORITYHOSTURL"                           = ""
          "AUTH_GRAPH_SCOPE"                                = ""
          "AUTH_TENANTID"                                   = ""
          "AUTH_APP_CLIENTSECRET"                           = ""
          "STORAGE_ACCOUNT_NAME"                            = ""
          "STORAGE_ACCOUNT_KEY"                             = ""
          "ApplicationInsightsAgent_EXTENSION_VERSION"      = "~3"
          "DiagnosticServices_EXTENSION_VERSION"            = "~3"
          "EVENTS_GRAPH_API_URL"                            = ""
          "InstrumentationEngine_EXTENSION_VERSION"         = "disabled"
          "KEY_VAULT_SECRET_NAME"                           = ""
          "KEY_VAULT_URL"                                   = ""
          "PLACES_GRAPH_API_URL"                            = ""
          "SnapshotDebugger_EXTENSION_VERSION"              = "disabled"
          "USERS_GRAPH_API_URL"                             = ""
          "WEBSITE_NODE_DEFAULT_VERSION"                    = "6.9.1"
          "XDT_MicrosoftApplicationInsights_BaseExtensions" = "disabled"
          "XDT_MicrosoftApplicationInsights_Mode"           = "recommended"
          "XDT_MicrosoftApplicationInsights_PreemptSdk"     = "disabled"
    }
}

resource "azurerm_key_vault" "keyVault" {
  name                = var.keyVault["name"]
  location            = azurerm_resource_group.resourceGroup.location
  resource_group_name = azurerm_resource_group.resourceGroup.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  sku_name = "standard"
}



resource "azurerm_key_vault_access_policy" "currentUserAccessPolicy" {
  key_vault_id = azurerm_key_vault.keyVault.id
  tenant_id = data.azurerm_client_config.current.tenant_id
  object_id = data.azurerm_client_config.current.object_id
  certificate_permissions = [
    "Get","List","Import", "Delete", "Purge", "Restore", "Create"
  ]

  secret_permissions = [
    "Get"
  ]

  key_permissions = [
    "Get"
  ]
}

resource "azurerm_key_vault_access_policy" "webAppAccessPolicy" {
  key_vault_id = azurerm_key_vault.keyVault.id
  tenant_id = data.azurerm_client_config.current.tenant_id
  object_id = azurerm_app_service.webApp.identity[0].principal_id
  
  certificate_permissions = [
    "Get","List"
  ]
  secret_permissions = [
    "Get"
  ]
}

resource "azurerm_key_vault_certificate" "pemCertificate" {
  name         = var.keyVault["certificateName"]
  key_vault_id = azurerm_key_vault.keyVault.id

  certificate_policy {
    issuer_parameters {
      name = "Self"
    }

    key_properties {
      exportable = true
      key_size   = 2048
      key_type   = "RSA"
      reuse_key  = true
    }

    lifetime_action {
      action {
        action_type = "AutoRenew"
      }

      trigger {
        lifetime_percentage = 80
      }
    }

    secret_properties {
      content_type = "application/x-pem-file"
    }

    x509_certificate_properties {
      # Server Authentication = 1.3.6.1.5.5.7.3.1
      # Client Authentication = 1.3.6.1.5.5.7.3.2
      extended_key_usage = ["1.3.6.1.5.5.7.3.1"]

      key_usage = [
        "cRLSign",
        "dataEncipherment",
        "digitalSignature",
        "keyAgreement",
        "keyCertSign",
        "keyEncipherment",
      ]

      subject            = "CN=tab-room-check-in-certificate"
      validity_in_months = 12
    }
  }
}

resource "azurerm_storage_account" "storageAccount" {
  name                     = var.storage["accountName"]
  location            = azurerm_resource_group.resourceGroup.location
  resource_group_name = azurerm_resource_group.resourceGroup.name
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_table" "tableStorage" {
  name                 = var.storage["roomTableName"]
  storage_account_name = azurerm_storage_account.storageAccount.name
}

resource "azurerm_storage_table" "tableStorage" {
  name                 = var.storage["eventTableName"]
  storage_account_name = azurerm_storage_account.storageAccount.name
}

resource "azurerm_storage_table" "tableStorage" {
  name                 = var.storage["userTableName"]
  storage_account_name = azurerm_storage_account.storageAccount.name
}

resource "azurerm_storage_table" "tableStorage" {
  name                 = var.storage["checkinTableName"]
  storage_account_name = azurerm_storage_account.storageAccount.name
}