import React,{useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db,auth} from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button,Input} from '@material-ui/core'
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';



//this is styling for modal..
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));  //modal style ends here



function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts,setPosts] = useState([]); //for posts
  const [open,setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username,setUsername] = useState('');  //for modal
  const [password,setPassword] = useState('');//for modal
  const [email,setEmail] = useState('');//for modal
  const[user,setUser] = useState(null);//took for login logout events

  useEffect(() => {
    //login logout events described here
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser){
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      }else{
        //user has logged out
        setUser(null);
      }
    })

    return ()=> {
      //perform cleanup action
      unsubscribe();//suppose we login,and we update the username,it's gonna re-fire the front-end code (i.e. dependancies)..before it does that,we are saying dettach the listener that just setup..then do re-fire
    }
  },[user,username]);


  //useEffect runs a piece of code based on condition
  //posts collection database
  useEffect(() =>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  },[])



  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))
  }



  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email,password)//passing email and password for authentication .. and if anything is wrong like username or password then error will catched.
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }


  return (
    <div className="App">
      
      {/*this modal is for signup feature*/}
      <Modal
        open={open}
        onClose={() =>  setOpen(false)} //this is function where, when you click outside modal,it will close        
      >
        <div style={modalStyle} className={classes.paper}>

        <form className="app__signup">
          <center>
            <img 
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
          </center>  
          <Input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signUp}>Sign Up</Button>
        </form>     
        </div>         
      </Modal>


      {/*this modal is for signin feature*/}
      <Modal
        open={openSignIn}
        onClose={() =>  setOpenSignIn(false)} //this is function where, when you click outside modal,it will close        
      >
        <div style={modalStyle} className={classes.paper}>

        <form className="app__signup">
          <center>
            <img 
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
          </center>  
          <Input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signIn}>Sign In</Button>
        </form>     
        </div>         
      </Modal>


      {/*body design from here */}
      <div className="app__header">
        <img 
        className= "app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />

        {/*checking whether user has loggedin or not */}
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>  
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>   {/*class app__header end*/}

      <div className="app__posts">
        <div className="app__postsLeft">
          {/*mapping through every post. props are passed */}
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id}  user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed 
            url="https://preview.keenthemes.com/metronic-v4/theme/assets/pages/media/profile/profile_user.jpg"
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            prtocol=''
            injectScript
            onLoading={() => {}}
            onSuccess= {() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
          
      </div>      



      {/*having caption input,file picker,post button to choose your image from file manager*/}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ):(
        <h3>Sorry You need to login to upload</h3>
      )}
      
    </div>  //class App end
  );
}

export default App;
