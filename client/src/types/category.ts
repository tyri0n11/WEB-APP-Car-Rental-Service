export interface Category {
    id: string
    name: string
    description?: string
    createdAt: string
    updatedAt: string
}

export interface CreateCategoryInput {
    name: string
    description?: string
}

export interface UpdateCategoryInput {
    name?: string
    description?: string
}

export interface CategoryContextValue {
    categories: Category[]
    isLoading: boolean
    error: string | null
    createCategory: (input: CreateCategoryInput) => Promise<void>
    deleteCategory: (id: string) => Promise<void>
    getCategory: (id: string) => Promise<Category>
    getAllCategories: () => Promise<void>
}