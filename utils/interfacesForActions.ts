export interface ReturnEditOrgNameData {
    success: boolean,
    successID?: string
};

export interface ReturnEditOrgUserSettingsData {
    success: boolean,
    successID?: string
};

export interface OrgMembersReturnData {
    success: boolean,
    orgMembers: {
      user_email: {user_email: any;}[];
      org_membership_role: any;
      org_membership_status: any;
      invited_by: {user_email: any;}[]
    },
    successID: string
};

export interface ReturnInviteUserToOrgData {
    success: boolean,
    successID?: string
};

export interface ReturnEditUserRoleInOrgData {
    success: boolean,
    successID?: string
};

export interface ReturnRemoveUserFromOrgData {
    success: boolean,
    successID?: string
};

