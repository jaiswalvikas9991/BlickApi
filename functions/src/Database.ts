interface Database {
    getUserDataByUid: (uid: string, filter?: {}) => Promise<{}>;
    getBuildingInfoById: (id: string) => Promise<{}>;
    getUserByFlatNumber: (flatN0: number, filter?: {}) => Promise<{}>;
    getAllUsersByBuilding: (buildingId: string, filter?: {}) => Promise<Array<{}>>;
    userLogin: (email: string, password: string) => Promise<any>;
    userSignUp: (email: string, password: string) => Promise<any>;
    checkIfEmailExists: (email: string) => Promise<boolean>;
    createNewUserDoc: (uid: string, email: string, buildingId: string, flatId: string) => Promise<boolean>;
    checkUserByBuildingId: (buildingId: string, email: string, flatNo: string) => Promise<boolean>,
    addUserToFlat: (buildingId: string, flatNo: string, email: string) => Promise<void>,
    addUserToAuthData: (uid: string, buildingId: string, flatNo: string) => Promise<void>,
    getAuthDataByUid : (uid : string) => Promise<{}>,
    getUsersInfoByFlat : (buildingId : string, flatId : string) => Promise<{}>
}

//You Can manage auth users using the admin api