const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_POOL_BASE = import.meta.env.VITE_APP_BASE_POOL_BASE

export const minioUpload = `${VITE_APP_BASE_WAREHOUSE}/minio/upload`
export const minioDownload = `${VITE_APP_BASE_WAREHOUSE}/minio/download`

export const resPoolMinioUpload = `${VITE_APP_BASE_POOL_BASE}/minio/upload`
export const resPoolMinioDownload = `${VITE_APP_BASE_POOL_BASE}/minio/download`