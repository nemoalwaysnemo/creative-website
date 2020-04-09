export enum NuxeoUserGroups {
  Admin = 'nuxeoAdmin-Admin',
  Everyone = 'Everyone-o-tbwa-AUTOPOP',
}

export enum UserPermission {
  Management = 'MANAGEMENT',
  Dev = 'DEVELOP',
  View = 'VIEW',
}

export const UserRole = {
  Client: {
    name: 'Client-User',
    permissions: [UserPermission.View],
  },
  Admin: {
    name: NuxeoUserGroups.Admin,
    permissions: [UserPermission.View, UserPermission.Management],
  },
  Developer: {
    name: 'Dev-User',
    permissions: [UserPermission.View, UserPermission.Management, UserPermission.Dev],
  },
};
