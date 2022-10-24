import fetch from '@/utils/request'


//Verification Code
export function $sendCode(params) {
  return fetch({
    url: '/doctor/send_auth_code',
    method: 'get',
    params
  })
}

//Sign in
export function $login(data) {
  return fetch({
    url: '/data/user/login',
    method: 'post',
    data
  })
}
//Get random fields
export function $getRandom(data) {
  return fetch({
    url: '/data/user/get_random',
    method: 'post',
    data
  })
}
//Get Folder Level

export function $getFolderList(params) {
  return fetch({
    url: '/data/folder/get_folder_list',
    method: 'get',
    params
  })
}


//Get Folder
export function $getFolder(params) {
  return fetch({
    url: '/data/folder/get_file_list',
    method: 'get',
    params
  })
}

//Count the number of castings
export function $statistics(params) {
  return fetch({
    url: '/data/file/get_nft_statistical',
    method: 'get',
    params
  })
}
//Get the number of folders and files
export function $folderStatistics(params) {
  return fetch({
    url: '/data/folder/get_file_statistical',
    method: 'get',
    params
  })
}
//Create New Folder
export function $createNewFolder(data) {
  return fetch({
    url: '/data/folder/add',
    method: 'post',
    data
  })
}
//addNFT
export function $collection(data) {
  return fetch({
    url: '/data/file/collection',
    method: 'post',
    data
  })
}
//Remove Folder
export function $removeFolder(data) {
  return fetch({
    url: '/data/folder/del',
    method: 'post',
    data
  })
}
//Remove File
export function $removeFile(data) {
  return fetch({
    url: '/data/file/remove',
    method: 'post',
    data
  })
}
//Rename
export function $uploadFolderName(data) {
  return fetch({
    url: '/data/folder/update',
    method: 'post',
    data
  })
}
//Add To Sinso
export function $addToSinso(data){
  return fetch({
    url:'/data/file/manually_click',
    method: 'post',
    data
  })
}

//Save NFT
export function $saveNft(data) {
  return fetch({
    url: '/data/file/mint_nft',
    method: 'post',
    data
  })
}
//Upload File
export function $uploadFile(data) {
  return fetch({
    url: '/data/file/file_upload',
    method: 'post',
    type:'form',
    data
  })
}
//Upload JSON file
export function $uploadJson(data) {
  return fetch({
    url: '/data/file/json_upload',
    method: 'post',
    data
  })
}
//move file
export function $move(data,type) {
  return fetch({
    url: `/data/${type}/move`,
    method: 'post',
    data
  })
}
//NFT Detail
export function $getDetail(params) {
  return fetch({
    url: '/data/file/get_detail',
    method: 'get',
    params
  })
}
