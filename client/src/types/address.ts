export interface Address {
    id: string
    userId: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    isDefault: boolean
    createdAt: string
    updatedAt: string
}

export interface AddressInput {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    isDefault?: boolean
}

export interface AddressContextState {
    addresses: Address[]
    isLoading: boolean
    error: Error | null
}

export interface AddressContextValue extends AddressContextState {
    fetchAddresses: () => Promise<void>
    saveAddress: (address: AddressInput) => Promise<Address>
    updateAddress: (addressId: string, address: Partial<AddressInput>) => Promise<Address>
    deleteAddress: (addressId: string) => Promise<boolean>
    setDefaultAddress: (addressId: string) => Promise<Address>
} 