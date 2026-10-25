import { ref } from "vue";
import shiba from "@/shiba";

/*
使用案例
	let state = reactive({
		view: {
			TypeList: [],
			fileList1: []
		},
		model: {
			content: "",
			type: "",
			images: ""
		}
	})
	const { deletePic, afterRead } = shiba.$hook.useUploadFile(state.view.fileList1);
*/

export function useFileUploader(fileList: any[]) {
  const uploadFilePromise = async (fileUrl) => {
    const res = await shiba.$api.upload.uploadFile(fileUrl);
    return {
      ...res.data,
    };
  };

  const deletePic = ({ index }) => {
    fileList.splice(index, 1);
  };

  const afterRead = async (files) => {
    let lists = [].concat(files.file);
    let fileListLen = fileList.length;
    lists.forEach((item) => {
      fileList.push({
        ...item,
        status: "uploading",
        message: "上传中",
      });
    });
    for (let i = 0; i < lists.length; i++) {
      const result = await uploadFilePromise(lists[i].url);
      let item = fileList[fileListLen];
      fileList.splice(fileListLen, 1, {
        ...item,
        status: "success",
        message: "",
        url: result.fullurl,
        fullurl: result.fullurl,
        // 实际提交Url
        fileUrl: result.url,
      });
      fileListLen++;
    }
  };

  return {
    deletePic,
    afterRead,
  };
}
