export enum NuxeoUserGroups {
  Admin = 'nuxeoAdmin-Admin',
  Everyone = 'Everyone-o-tbwa-AUTOPOP',
}

export enum UserPermission {
  Mgt = 'MGT',
  Dev = 'DEV',
  View = 'VIEW',
}

export const UserRole = {
  Client: {
    name: 'Client-User',
    permissions: [UserPermission.View],
  },
  Admin: {
    name: NuxeoUserGroups.Admin,
    permissions: [UserPermission.View, UserPermission.Mgt],
  },
  Developer: {
    name: 'Dev-User',
    permissions: [UserPermission.View, UserPermission.Mgt, UserPermission.Dev],
  },
};
