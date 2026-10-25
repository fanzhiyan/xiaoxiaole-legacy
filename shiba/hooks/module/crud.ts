
export const useCrud=()=>{
	
	
	// c
	const CreateData = async (fun:) => {
	  // 模拟异步请求
	  return new Promise((resolve) => {
	    setTimeout(() => {
	      resolve([
	        { id: 1, name: 'Item 1' },
	        { id: 2, name: 'Item 2' },
	        { id: 3, name: 'Item 3' }
	      ]);
	    }, 1000);
	  });
	};
	
	
	//r
	const ReadData= async (fun:) => {
	  // 模拟异步请求
	  return new Promise((resolve) => {
	    setTimeout(() => {
	      resolve([
	        { id: 1, name: 'Item 1' },
	        { id: 2, name: 'Item 2' },
	        { id: 3, name: 'Item 3' }
	      ]);
	    }, 1000);
	  });
	};
	
	
	// u
	const UpdateData= async (fun:) => {
	  // 模拟异步请求
	  return new Promise((resolve) => {
	    setTimeout(() => {
	      resolve([
	        { id: 1, name: 'Item 1' },
	        { id: 2, name: 'Item 2' },
	        { id: 3, name: 'Item 3' }
	      ]);
	    }, 1000);
	  });
	};
	
	// d
	const DeleteData= async (fun:) => {
	  // 模拟异步请求
	  return new Promise((resolve) => {
	    setTimeout(() => {
	      resolve([
	        { id: 1, name: 'Item 1' },
	        { id: 2, name: 'Item 2' },
	        { id: 3, name: 'Item 3' }
	      ]);
	    }, 1000);
	  });
	};
	
	
}