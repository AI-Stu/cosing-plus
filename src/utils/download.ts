import axios from 'axios';
import FileSaver from 'file-saver';
import { AxiosLoading } from './loading';
import { globalHeaders } from './request';
import errorCode from '@/utils/errorCode';

const baseURL = import.meta.env.VITE_APP_BASE_API_DEV;

const axiosLoading = new AxiosLoading();
const message = useMessage();
export default {
  async oss(ossId: string | number) {
    const url = `${baseURL}/resource/oss/download/${ossId}`;
    axiosLoading.addLoading();
    try {
      const res = await axios({
        method: 'get',
        url,
        responseType: 'blob',
        headers: globalHeaders()
      });
      const isBlob = res.data !== 'application/json';
      if (isBlob) {
        const blob = new Blob([res.data], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, decodeURIComponent(res.headers['download-filename'] as string));
      }
      else {
        this.printErrMsg(res.data);
      }
      axiosLoading.closeLoading();
    }
    catch (r) {
      console.error(r);
      message.error('下载文件出现错误，请联系管理员！');
      axiosLoading.closeLoading();
    }
  },
  async zip(url: string, name: string) {
    url = baseURL + url;
    axiosLoading.addLoading();
    try {
      const res = await axios({
        method: 'get',
        url,
        responseType: 'blob',
        headers: globalHeaders()
      });
      const isBlob = res.data !== 'application/json';
      if (isBlob) {
        const blob = new Blob([res.data], { type: 'application/zip' });
        FileSaver.saveAs(blob, name);
      }
      else {
        this.printErrMsg(res.data);
      }
      axiosLoading.closeLoading();
    }
    catch (r) {
      console.error(r);
      message.error('下载文件出现错误，请联系管理员！');
      axiosLoading.closeLoading();
    }
  },
  async printErrMsg(data: any) {
    const resText = await data.text();
    const rspObj = JSON.parse(resText);
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode.default;
    message.error(errMsg);
  }
};
