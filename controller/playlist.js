const HttpStatus=require('http-status-codes');
const apiUtils=require('../utils/apiUtils')
const globalConstant=require('../utils/globalConstant');
const Playlist = require('../models/playlist')


//API for creating new playlist
exports.addnewPlaylist = (req,res)=>{
  //Mapping the data that is provided into the schema 
const playlist = new Playlist({
    userId:req.body.userId,
    title:req.body.title,
    visibility:req.body.privacy,
    movies : req.body.movieData

})
//Saving the data for creating new playlist
playlist.save()
.then(() => {
    res.status(HttpStatus.CREATED).json(apiUtils.getResponseMessage(HttpStatus.CREATED,"Added to playlist succesfully"));
})
.catch(err => {
res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(apiUtils.getResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR,err.message));
})

}



// API for adding new movie to existing playlist
exports.addPlaylist = (req,res)=>{
//Finding playlist on basis of uniqueId provided to each playlist
   Playlist.find({_id:req.body._id})
  .then(()=>{
    //Adding new movies to the playlist
   Playlist.updateOne({_id:req.body._id},{$push:{movies:req.body.movieData}})
   .then(()=>{
     return res.status(201).json({msg:"created"});
   })
   .catch(err=>{
     console.log(err)
   })
  })
  .catch(err=>{
    console.log(err.message)
  });
}

//API for fetching details of all playlist
exports.getPlaylist = (req,res)=>{
  //Fetching all the playlist and sending it to the frontend
Playlist.find({},{"movies":0}).then((data)=>{
  res.status(HttpStatus.OK).json(apiUtils.getResponseMessage(HttpStatus.OK,data));
})
.catch((err)=>{
res.status(HttpStatus.InternalServerError).json(apiUtils.getResponseMessage(HttpStatus.InternalServerError,err.message))
})
}

//API for getting information about a particular playlist
exports.getlistDetails = (req,res)=>{
  let {id} = req.params
 //Finding playlist on the basis of id provided
  Playlist.find({_id:id})
  .then((data)=>{
  return res.status(200).json({response:data})
  })
}