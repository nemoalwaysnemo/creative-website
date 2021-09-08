export enum NuxeoUserGroups {
  Admin = 'nuxeoAdmin-Admin',
  Everyone = 'Everyone-o-tbwa-AUTOPOP',
}

export enum UserPermission {
  Mgt = 'MGT',
  Dev = 'DEV',
  View = 'VIEW',
  CreativeRingMgt = 'CreativeRingMgt',
}

export const UserRole = {
  Client: {
    name: 'Client',
    permissions: [UserPermission.View],
  },
  Admin: {
    name: NuxeoUserGroups.Admin,
    permissions: [UserPermission.View, UserPermission.Mgt, UserPermission.CreativeRingMgt],
  },
  Developer: {
    name: 'Developer',
    permissions: [UserPermission.View, UserPermission.Mgt, UserPermission.Dev, UserPermission.CreativeRingMgt],
  },
  CreativeRingMgt: {
    name: 'CreativeRing-Manager',
    permissions: [UserPermission.CreativeRingMgt],
  },
};
