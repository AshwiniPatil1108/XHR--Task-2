const cl = console.log;
const postConainer = document.getElementById("postConainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const userId = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
//const = document.getElementById("");

const BASE_URL =`https://jsonplaceholder.typicode.com/`
const POST_URL = `${BASE_URL}/posts`

let postArr =[];
//1st step get 
const teplating =(arr)=>{
    let result ='';
    arr.forEach(ele =>{
        result+=`
            <div class="col-md-4 mb-3">
                <div class="card h-100 postcard " id ="${ele.id}">
                    <div class="card-header">
                        <h3 class="m-0">
                            ${ele.title}
                        </h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">
                            ${ele.body}
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick ="onEdit(this)"class="btn btn-sm btn-outline-warning">Edit</button>
                        <button onclick ="onDelete(this)" class="btn btn-sm btn-outline-danger">Remove</button>
                    </div>
                </div>
            </div>
        `
    });
    postConainer.innerHTML=result;
}

const fetchPosts =()=>{
    //api cl
    loader.classList.remove("d-none")
    let xhr = new XMLHttpRequest()

    xhr.open("GET", POST_URL, true);
    
    xhr.onload = function(){
        cl(xhr.status)
        if(xhr.status >= 200 && xhr.status < 300){
            postArr = JSON.parse(xhr.response)
            cl(postArr)
            teplating(postArr)
        }
        loader.classList.add("d-none")
    }
    
    xhr.send()   
}

fetchPosts();

//3rd step edit

const onEdit =(ele)=>{
    cl(ele)
    let editId = ele.closest(".card").id;
    localStorage.setItem("editId", editId)
    let EDIT_URL =`${BASE_URL}/posts/${editId}`

    //api cl
    loader.classList.remove("d-none")
    let xhr = new XMLHttpRequest();

    xhr.open("GET",EDIT_URL)

    xhr.onload= function(){
        cl(xhr.response)
       setTimeout(()=>{
        if(xhr.status >= 200 && xhr.status < 300){
            let post = JSON.parse(xhr.response);
            titleControl.value = post.title;
            contentControl.value = post.body;
            userId.value = post.userId;
            updateBtn.classList.remove("d-none");
            submitBtn.classList.add("d-none");
        }
        loader.classList.add("d-none")
        window.scrollTo(0,1)
       },500)
    
    }
    xhr.send();

}

//4rth update
const onpostUpdate =()=>{
    let updatedObj= {
        title:titleControl.value,
        body:contentControl.value,
        userId:userId.value
    }
    cl(updatedObj)
    let updateId = localStorage.getItem("editId")

    let UPDATE_URL =`${BASE_URL}/posts/${updateId}`

    //api cl
    loader.classList.remove("d-none")
    let xhr = new XMLHttpRequest()

    xhr.open("PATCH", UPDATE_URL)

    xhr.onload =function(){
        cl(xhr.response)
       if(xhr.status >= 200 && xhr.status<300){
        cl(this.response)
        let card = [...document.getElementById(updateId).children]
        cl(card)
        card[0].innerHTML=`<h3 class="m-0">${updatedObj.title}</h3>`
        card[1].innerHTML=`<p class="m-0">${updatedObj.body}</p>`
        postForm.reset()
        updateBtn.classList.add('d-none');
        submitBtn.classList.remove('d-none')
       }

        loader.classList.add("d-none")
    }

    xhr.send(JSON.stringify(updatedObj));



}

// 5th set delete 
const onDelete =(ele)=>{
    Swal.fire({
       title:"REMOVE POST??",
       showCancelButton :true,
       confirmButtonText :"remove",
       confirmButtonColor: "#3085d6",
       cancelButtonColor: "#d33",
       confirmButtonText: "Yes, remove it!",
       icon:"warning",
   }).then((result) =>{
       if(result.isConfirmed){
       let removeId = ele.closest('.card').id;
  
       let REMOVE_URL = `${BASE_URL}/posts/${removeId}`
      
   
   
       loader.classList.remove("d-none")
       let xhr = new XMLHttpRequest();
       xhr.open("DELETE", REMOVE_URL);
   
       xhr.onload = function(){
           cl(xhr.status);
           if(xhr.status >= 200 && xhr.status < 300){
              ele.closest(`.col-md-4`).remove()
           }
           loader.classList.add("d-none")
          
       }
       xhr.send()
      Swal.fire({
       title:"Post Removed Successfully",
       timer:2500,
       icon:"success"
      })
   }
   })
 
  
}

//2nd step
const onpostSubmit = (eve)=>{
    eve.preventDefault()
    let newPost ={
        title:titleControl.value,
        body:contentControl.value,
        userId:userId.value
    }
    cl(newPost);
    postForm.reset();
    //api cl
    loader.classList.remove("d-none")
    let xhr = new XMLHttpRequest();

    xhr.open("POST", POST_URL);

    xhr.onload = function(){
      
        if(xhr.status >=200 && xhr.status <300){
              cl(xhr.response)
              newPost.id = JSON.parse(xhr.response);
              let div = document.createElement("div")
              div.className ="col-md-4 mb-4"
              div.innerHTML=`
                       
                            <div class="card postcard h-100" id ="${newPost.id}">
                                <div class="card-header">
                                    <h3 class="m-0">
                                        ${newPost.title}
                                    </h3>
                                </div>
                                <div class="card-body">
                                    <p class="m-0">
                                        ${newPost.body}
                                    </p>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                    <button onclick ="onEdit(this)" class="btn btn-sm btn-outline-warning">Edit</button>
                                    <button onclick ="onDelete(this)" class="btn btn-sm btn-outline-danger">Remove</button>
                                </div>
                            </div>
                        
              `
            postConainer.prepend(div)
        }
        loader.classList.add("d-none")
    }

    xhr.send(JSON.stringify(newPost));
}

postForm.addEventListener("submit", onpostSubmit);
updateBtn.addEventListener("click", onpostUpdate);
