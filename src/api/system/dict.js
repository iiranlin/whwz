import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = import.meta.env.VUE_APP_BASE_SERVER;

const VITE_APP_MATERIAL_DATA = import.meta.env.VITE_APP_MATERIAL_DATA

// 查询字典数据列表
export function commonPage(query) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dict/list`,
    method: 'get',
    params: query
  })
}

export function commonTree(query) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/dict/tree`,
      method: 'get',
      params: query
    })
  }

  export function commonCreate(data) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/dict/create`,
      method: 'post',
      data
    })
  }

  export function commonModify(data) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/dict/modify`,
      method: 'post',
       data
    })
  }

  export function commonDeleteBatch(data) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/dict/deleteBatch`,
      method: 'post',
      data
    })
  }

  export function commonDetail(id) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/dict/detail/${id}`,
      method: 'get',
    })
  }

export function getChildListByParentId(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dict/getChildListByParentId`,
    method: 'get',
    params
  })
}

export function getListByParentCode(code) {
  return new Promise(async (resolve, reject) => {
      try {
        // let res = await IDB.getObjectStore('dict',code)
        // if(!res) {
          const res = await request({
            url: `${VUE_APP_BASE_PREFIX}/dict/getListByParentCode/${code}`,
            method: 'get',
          })
          // await IDB.setObjectStore('dict',code, {data: res.data})
        // }
        resolve({data: res.data})
      }catch(err){
        reject(err)
      }
    })
}

export const refreshCache = ()=>{
    return request({
        url: `${VUE_APP_BASE_PREFIX}/dict/refreshCache`,
        method: 'get',
    })
}

/**
 * 根据父ID获得子最大排序号
 * @param {*} params {parentId:""}
 * @returns
 */
export const getMaxSeqByParentId = (params) => {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/dict/getMaxSeqByParentId`,
        method: 'get',
        params
    })
}


// 查询物资目录树
export function getMatlCategoryTree() {
  return request({
    url: `${VITE_APP_MATERIAL_DATA}/rmstat/matlcate/listMatlCateTree`,
    method: 'get'
  })
}
