import request from '@/utils/request1'

const temaTree = {
    // 获取部门树列表
    getDeptTree(){
        return request({
            url: '/system/user/deptTree',
            method: 'get',
        })
    },
    // 根据部门id分页查询用户列表
    getUserTree(id,params){
        return request({
            url: '/system/user/page/'+ id,
            method: 'get',
            params: params
        })
    },
}
export default temaTree