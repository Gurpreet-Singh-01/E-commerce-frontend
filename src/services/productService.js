import api from './api'

export const getProducts = async(params = {}) =>{
    const response = await api.get('/product/',{params})
    return response.data.data
}

export const getProductById = async(id) =>{
    const response = await api.get(`/product/${id}`)
    return response.data.data
}

export const createProduct = async(data) =>{
    const response = await api.post('/product/',data)
    return response.data.data
}

export const updateProduct = async(id,data) =>{
    const response = await api.patch(`/product/${id}`,data)
    return response.data.data
}

export const deleteProduct = async(id) =>{
    const response = await api.delete(`/product/${id}`)
    return response.data.data
}