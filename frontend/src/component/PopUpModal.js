import React, { useState } from 'react';
import './PopUpModal.css';
import previewImg from '../images/images.png'; // Import the previewImg variable
import { toast } from 'react-toastify';
import axios from 'axios';

const PopUpModal = ({getAllTweets}) => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const createTweet = async (event) => {
    event.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append('content', content);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await axios.post(`http://localhost:4000/api/v1/tweet`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set Content-Type to 'multipart/form-data'
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      getAllTweets()
      if (response.status === 201) {
        toast.success("Tweeted Successfully");
        console.log(response.data);
        setContent('');
        setImagePreview('');
      }
    } catch (error) {
      console.error("Error creating tweet:", error);
      toast.error(error.message || "Failed to create tweet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Tweet</button>
      <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">New Tweet</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={createTweet}>
              <div className="modal-body">
                <div className="mb-3">
                  <textarea className="form-control" id="message-text" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="imageInput" className="custom-file-upload">
                    <img src={imagePreview || previewImg} alt="Logo" className="logo-image" />
                  </label>
                  <input type="file" className="form-control-file" id="imageInput" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  {imagePreview && <img src={imagePreview} alt="ImagePreview" className="img-fluid mt-2" />}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <input type="submit" className="btn btn-primary" data-bs-dismiss="modal" value={loading ? "Loading..." : "Tweet"} disabled={loading} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopUpModal;
