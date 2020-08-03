export const uploadFileWithXhr = async(file:File, url:string, method:string="POST"):Promise<any> => {
  return new Promise((resolve, reject)=>{
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
      } else {
          reject({
              status: this.status,
              statusText: xhr.statusText
          });
      }
    };
    xhr.onerror = function () {
      reject({
          status: this.status,
          message: xhr.statusText
      });
    };
    
    xhr.send(file); 
  });
}