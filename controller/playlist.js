const HttpStatus=require('http-status-codes');
const apiUtils=require('../utils/apiUtils')
const globalConstant=require('../utils/globalConstant');
const Playlist = require('../models/playlist')

exports.addnewPlaylist = (req,res)=>{
const playlist = new Playlist({
    userId:req.body.userId,
    title:req.body.title,
    visibility:req.body.privacy,
    movies : req.body.movieData

})
playlist.save()
.then(() => {
    res.status(HttpStatus.CREATED).json(apiUtils.getResponseMessage(HttpStatus.CREATED,"Added to playlist succesfully"));
})
.catch(err => {
res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(apiUtils.getResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR,err.message));
})

}



// 
exports.addPlaylist = (req,res)=>{
  // console.log(typeof(req.body._id))
   Playlist.find({_id:req.body._id})
  
  .then(()=>{
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

//
exports.getPlaylist = (req,res)=>{
Playlist.find({},{"movies":0}).then((data)=>{
  res.status(HttpStatus.OK).json(apiUtils.getResponseMessage(HttpStatus.OK,data));
})
.catch((err)=>{
res.status(HttpStatus.InternalServerError).json(apiUtils.getResponseMessage(HttpStatus.InternalServerError,err.message))
})
}

exports.getlistDetails = (req,res)=>{
  let {id} = req.params
  console.log(id);
  Playlist.find({_id:id})
  .then((data)=>{
  return res.status(200).json({response:data})
  })
  // res.status(200).json({msg:"hello mfcker"})
// Playlist.find({_id:req.body.playlistId})
}