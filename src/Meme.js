import React, { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';

const Meme = () => {
  const [meme, setMeme] = useState({
    topText: '',
    bottomText: '',
    randomImage: 'http://i.imgflip.com/1bij.jpg'
  });
  const [allMemes, setAllMemes] = useState([]);
  const [memeUrl, setMemeUrl] = useState('');
  const fileInputRef = useRef(null);
  const memeRef = useRef(null);

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then(res => res.json())
      .then(data => setAllMemes(data.data.memes));
  }, []);

  const getMemeImage = () => {
    const randomNumber = Math.floor(Math.random() * allMemes.length);
    const url = allMemes[randomNumber].url;
    setMeme(prevMeme => ({
      ...prevMeme,
      randomImage: url
    }));
  };

  const handleChange = (event) => {
    const {name, value} = event.target;
    setMeme(prevMeme => ({
      ...prevMeme,
      [name]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMeme(prevMeme => ({
          ...prevMeme,
          randomImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const generateMemeUrl = async () => {
    try {
      const dataUrl = await htmlToImage.toPng(memeRef.current);
      setMemeUrl(dataUrl);
    } catch (error) {
      console.error('Error generating meme URL:', error);
      alert('Failed to generate meme URL. Please try again.');
    }
  };

  const handleShareFacebook = () => {
    if (!memeUrl) {
      alert('Please generate the meme first by clicking "Generate Meme URL"');
      return;
    }
    
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(memeUrl)}`;
    window.open(facebookShareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <main>
      <div className="form">
        <input 
          type="text"
          placeholder="Top text"
          name="topText"
          value={meme.topText}
          onChange={handleChange}
        />
        <input 
          type="text"
          placeholder="Bottom text"
          name="bottomText"
          value={meme.bottomText}
          onChange={handleChange}
        />
        <button onClick={getMemeImage}>Get a new meme image 🖼</button>
        <button onClick={handleUploadClick}>Upload your own image 📤</button>
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          accept="image/*"
        />
        <button onClick={generateMemeUrl}>Generate Meme URL</button>
        <button onClick={handleShareFacebook}>Share on Facebook</button>
      </div>
      <div className="meme" ref={memeRef}>
        <img src={meme.randomImage} alt="Meme" />
        <h2 className="meme--text top">{meme.topText}</h2>
        <h2 className="meme--text bottom">{meme.bottomText}</h2>
      </div>
    </main>
  );
};

export default Meme;