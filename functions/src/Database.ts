interface Database {
    getOneUserByEmail: (email: string, filter? : {}) => Promise<{}>;
    getUserByFlatNumber: (flatN0: number, filter? : {}) => Promise<{}>;
    getAllUsersByBuilding : (buildingId : string, filter? : {}) => Promise<Array<{}>>;
    userLogin : (email : string, password : string) => Promise<any>;
    userSignUp : (email : string, password : string) => Promise<any>;
    checkIfEmailExists : (email : string) => Promise<boolean>;
    createNewUserDoc : (uid : string) => Promise<boolean>;
}

//You Can manage auth users using the admin api