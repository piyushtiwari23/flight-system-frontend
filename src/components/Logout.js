export default function logout(navigate) {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/')
}