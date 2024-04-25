import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const PicUploadMoadl = ({getSingleUserDetails,getAllTweets}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toggleWidth,setToggleWidth]= useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      const CONFIG_OBJ = {
        headers: {
          "Content-Type": 'multipart/form-data',
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      };

      await axios.post('http://localhost:4000/api/v1/upload-image', formData, CONFIG_OBJ);
      toast.success('Profile picture updated successfully!');
      setSelectedFile(null);
      setPreviewImage(null);
      getAllTweets();
      getSingleUserDetails()
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Error uploading profile picture');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setToggleWidth(window.innerWidth < 600);
    };
    
    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    
    // Call handleResize once initially to set the initial state
    handleResize();

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div>
        {/* Button trigger modal */}
        <button type="button" className="btn btn-light border border-primary text-primary me-1" data-bs-toggle="modal" data-bs-target="#picUploadModal">
          { toggleWidth ? "Upload":"Upload Profile Picture"}
        </button>

        {/* Modal */}
        <div className="modal fade" id="picUploadModal" aria-labelledby="picUploadModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleUpload}>
                <div className="modal-header">
                  <h5 className="modal-title" id="picUploadModalLabel">Upload Profile Pic</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <div className="alert alert-secondary" role="alert">
                Note: The image should be a square in shape  
                </div>
                  <div className="mb-3">
                    <input className="form-control" type="file" id="fileUpload" accept="image/*" onChange={handleFileChange} required/>
                  </div>
                  {previewImage && <img src={previewImage} alt="Preview" className="img-fluid mb-3" />}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <input type="submit" className="btn btn-primary"  value={loading ? "Loading..." : "Upload"}  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PicUploadMoadl;
