// import axiosfrom "axios"
// export const myAxios=axios.create({
//     baseURL:"http://localhost:5000/api/v1/react/",
//     withCredentials:true})
// export default myAxios
import http from "./http.js"
const apiUrl=`https://nestoria-server-zeta.vercel.app/api/v1/fur`;
const createUser= data => http.post(`${apiUrl}/auth/signup`,data)
const userApi={createUser}
export default userApi
