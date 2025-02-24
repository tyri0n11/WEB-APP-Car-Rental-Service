declare class UpdateDrivingLicenceDTO {
    licenceNumber: string;
    drivingLicenseImages: string[];
    expiryDate: string;
}
export declare class UpdateUserRequestDTO {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    drivingLicence?: UpdateDrivingLicenceDTO;
}
export {};
