# TEST#1 (internal & external users in new event and new room)
```json
{
    "users": [
        {
            "displayName": "Black Panther",
            "mail": "black.panther@marvel.onmicrosoft.com",
            "principalName": "black.panther@marvel.onmicrosoft.com",
            "phone": "+61487306655",
            "employeeId": "001",
            "id": "87d349ed-44d7-43e1-9a83-5f2406dee5bd"
        },
        {
            "displayName": "Iron Man",
            "mail": "iron.man@marvel.onmicrosoft.com",
            "principalName": "iron.man@marvel.onmicrosoft.com",
            "phone": "+61487302312",
            "employeeId": "002",
            "id": "77d349ed-44d7-43e1-9a83-5f2406dee5ee"
        },
        {
            "displayName": "Batman",
            "mail": "batman@dccomics.onmicrosoft.com",
            "external": true
        },
        {
            "displayName": "Superman",
            "mail": "superman@dccomics.onmicrosoft.com",
            "phone": "+61487112398",
            "external": true
        }
    ],
    "event": {
        "id": "AAMkAGIAAAoZDOFAAA=",
        "subject": "Orientation",
        "start": "2021-06-24T02:14:17.119Z",
        "end": "2021-06-24T04:14:17.119Z",
        "locationDisplayName": "Conf Room 100",
        "locationEmail": "cf100@contoso.com"
    },
    "room": {
        "id": "3162F1E1-C4C0-604B-51D8-91DA78989EB1",
        "emailAddress": "cf100@contoso.com",
        "displayName": "Conf Room 100",
        "phone": "000-000-0000",
        "capacity": 10,
        "building": "1"
    }
}
```

# TEST#2 (internal & external users in new event in existing room)
```json
{
    "users": [
        {
            "displayName": "Black Panther",
            "mail": "black.panther@marvel.onmicrosoft.com",
            "principalName": "black.panther@marvel.onmicrosoft.com",
            "phone": "+61487306655",
            "employeeId": "001",
            "id": "87d349ed-44d7-43e1-9a83-5f2406dee5bd"
        },
        {
            "displayName": "Batman",
            "mail": "batman@dccomics.onmicrosoft.com",
            "external": true
        },
        {
            "displayName": "Superman",
            "mail": "superman@dccomics.onmicrosoft.com",
            "phone": "+61487112398",
            "external": true
        }
    ],
    "event": {
        "id": "BBLTAGIAAAoZDOFCCC=",
        "subject": "Invasion",
        "start": "2021-07-24T02:14:17.119Z",
        "end": "2021-07-24T03:16:17.119Z",
        "locationDisplayName": "Conf Room 100",
        "locationEmail": "cf100@contoso.com"
    },
    "room": {
        "id": "3162F1E1-C4C0-604B-51D8-91DA78989EB1",
        "emailAddress": "cf100@contoso.com",
        "displayName": "Conf Room 100",
        "phone": "000-000-0000",
        "capacity": 10,
        "building": "1"
    }
}
```

# TEST#3 (internal users in new event in existing room)
```json
{
    "users": [
        {
            "displayName": "Black Panther",
            "mail": "black.panther@marvel.onmicrosoft.com",
            "principalName": "black.panther@marvel.onmicrosoft.com",
            "phone": "+61487306655",
            "employeeId": "001",
            "id": "87d349ed-44d7-43e1-9a83-5f2406dee5bd"
        },
        {
            "displayName": "Iron Man",
            "mail": "iron.man@marvel.onmicrosoft.com",
            "principalName": "iron.man@marvel.onmicrosoft.com",
            "phone": "+61487302312",
            "employeeId": "002",
            "id": "77d349ed-44d7-43e1-9a83-5f2406dee5ee"
        }
    ],
    "event": {
        "id": "KLMkAGIAAAoZDOFARR=",
        "subject": "Marvel",
        "start": "2021-06-24T07:14:17.119Z",
        "end": "2021-06-24T09:14:17.119Z",
        "locationDisplayName": "Conf Room 100",
        "locationEmail": "cf100@contoso.com"
    },
    "room": {
        "id": "3162F1E1-C4C0-604B-51D8-91DA78989EB1",
        "emailAddress": "cf100@contoso.com",
        "displayName": "Conf Room 100",
        "phone": "000-000-0000",
        "capacity": 10,
        "building": "1"
    }
}
```

# TEST#4 (internal users in new event in new room)
```json
{
     "users": [
        {
            "displayName": "Black Panther",
            "mail": "black.panther@marvel.onmicrosoft.com",
            "principalName": "black.panther@marvel.onmicrosoft.com",
            "phone": "+61487306655",
            "employeeId": "001",
            "id": "87d349ed-44d7-43e1-9a83-5f2406dee5bd"
        },
        {
            "displayName": "Iron Man",
            "mail": "iron.man@marvel.onmicrosoft.com",
            "principalName": "iron.man@marvel.onmicrosoft.com",
            "phone": "+61487302312",
            "employeeId": "002",
            "id": "77d349ed-44d7-43e1-9a83-5f2406dee5ee"
        }
    ],
    "event": {
        "id": "KLMkDWERToZDOFARR=",
        "subject": "Marvel Future",
        "start": "2021-06-24T10:14:17.119Z",
        "end": "2021-06-24T11:14:17.119Z",
        "locationDisplayName": "Conf Room 200",
        "locationEmail": "cf300@contoso.com"
    },
    "room": {
        "id": "1162F1E1-C4C0-604B-51D8-91DA78989FF1",
        "emailAddress": "cf200@contoso.com",
        "displayName": "Conf Room 200",
        "phone": "000-000-0000",
        "capacity": 3,
        "building": "2"
    }
}
```

# TEST#5 (external users in new event in new room)
```json
{
    "users": [
        {
            "displayName": "Batman",
            "mail": "batman@dccomics.onmicrosoft.com",
            "external": true
        },
        {
            "displayName": "Superman",
            "mail": "superman@dccomics.onmicrosoft.com",
            "phone": "+61487112398",
            "external": true
        }
    ],
    "event": {
        "id": "KLMkDWERToZDOFARR=",
        "subject": "DC Comics",
        "start": "2021-06-24T10:14:17.119Z",
        "end": "2021-06-24T11:14:17.119Z",
        "locationDisplayName": "Conf Room 300",
        "locationEmail": "cf300@contoso.com"
    },
    "room": {
        "id": "5562F1E1-C4C0-604B-51D8-91DA78989DD1",
        "emailAddress": "cf300@contoso.com",
        "displayName": "Conf Room 300",
        "phone": "000-000-0000",
        "capacity": 3,
        "building": "2"
    }
}
```

# TEST#6 (internal & external users in ad-hoc event in existing room)
```json
{
    "users": [
        {
            "displayName": "Black Panther",
            "mail": "black.panther@marvel.onmicrosoft.com",
            "principalName": "black.panther@marvel.onmicrosoft.com",
            "phone": "+61487306655",
            "employeeId": "001",
            "id": "87d349ed-44d7-43e1-9a83-5f2406dee5bd"
        },
        {
            "displayName": "Batman",
            "mail": "batman@dccomics.onmicrosoft.com"
        },
        {
            "displayName": "Superman",
            "mail": "superman@dccomics.onmicrosoft.com",
            "phone": "+61487112398"
        }
    ],
    "event": {
        "locationDisplayName": "Conf Room 100",
        "locationEmail": "cf100@contoso.com"
    },
    "room": {
        "id": "3162F1E1-C4C0-604B-51D8-91DA78989EB1",
        "emailAddress": "cf100@contoso.com",
        "displayName": "Conf Room 100",
        "phone": "000-000-0000",
        "capacity": 10,
        "building": "1"
    }
}
```

# TEST#6 (internal users in ad-hoc event in existing room)
```json
{
    "users": [
        {
            "displayName": "Black Panther",
            "mail": "black.panther@marvel.onmicrosoft.com",
            "principalName": "black.panther@marvel.onmicrosoft.com",
            "phone": "+61487306655",
            "employeeId": "001",
            "id": "87d349ed-44d7-43e1-9a83-5f2406dee5bd"
        },
        {
            "displayName": "Iron Man",
            "mail": "iron.man@marvel.onmicrosoft.com",
            "principalName": "iron.man@marvel.onmicrosoft.com",
            "phone": "+61487302312",
            "employeeId": "002",
            "id": "77d349ed-44d7-43e1-9a83-5f2406dee5ee"
        }
    ],
    "event": {
        "locationDisplayName": "Conf Room 200",
        "locationEmail": "cf200@contoso.com"
    },
    "room": {
        "id": "1162F1E1-C4C0-604B-51D8-91DA78989FF1",
        "emailAddress": "cf200@contoso.com",
        "displayName": "Conf Room 200",
        "phone": "000-000-0000",
        "capacity": 10,
        "building": "1"
    }
}
```

# TEST#7 (internal users in ad-hoc event in new room)
```json
{
    "users": [
        {
            "displayName": "Black Panther",
            "mail": "black.panther@marvel.onmicrosoft.com",
            "principalName": "black.panther@marvel.onmicrosoft.com",
            "phone": "+61487306655",
            "employeeId": "001",
            "id": "87d349ed-44d7-43e1-9a83-5f2406dee5bd"
        },
        {
            "displayName": "Iron Man",
            "mail": "iron.man@marvel.onmicrosoft.com",
            "principalName": "iron.man@marvel.onmicrosoft.com",
            "phone": "+61487302312",
            "employeeId": "002",
            "id": "77d349ed-44d7-43e1-9a83-5f2406dee5ee"
        }
    ],
    "event": {
        "locationDisplayName": "Conf Room 400",
        "locationEmail": "cf400@contoso.com"
    },
    "room": {
        "id": "5762G1G1-C4C0-604B-51D8-91DA78989XX4",
        "emailAddress": "cf400@contoso.com",
        "displayName": "Conf Room 400",
        "phone": "000-000-0000",
        "capacity": 5,
        "building": "2"
    }
}
```