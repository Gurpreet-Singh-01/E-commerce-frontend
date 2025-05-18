import api from './api'

export const getCart = async () =>{
    const response = await api.get('/cart/')
    return response.data
}

export const addtoCart = async(productId,quantity = 1) =>{
    const response = await api.post('/cart/',{productId,quantity})
    return response.data
}

export const updateCartItem = async(productId,quantity) =>{
    const response = await api.patch(`/cart/${productId}`,quantity)
    return response.data
}

export const removeItemFromCart = async(productId) =>{
    const response = await api.delete(`/cart/${productId}`)
    return response.data
}

export const clearFullCart = async() =>{
    await api.delete('/cart/clear_cart')
}