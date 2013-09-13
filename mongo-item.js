module.exports = function(mongoose) {
  var cursorPosition = mongoose.Schema({ clientId: String, posX: Number, posY: Number, time: Date});
  return mongoose.model("CursorPosition", cursorPosition);  
}