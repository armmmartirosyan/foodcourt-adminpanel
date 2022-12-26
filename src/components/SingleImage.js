import React from 'react';
import _ from "lodash";
import PropTypes from "prop-types";

const {REACT_APP_API_URL} = process.env;

function SingleImage(props) {
    const {image, obj, handleChangeImage} = props;

    return (
        <figure className='modal-img-container'>
            <img
                src={
                    !_.isEmpty(image) ? image._src
                        : `${REACT_APP_API_URL}/${obj.imagePath}`
                }
                alt="image"
                className='modal-img'
            />
            {
                image.type ? (
                    <div
                        className="modal-img-delete"
                        onClick={() => {
                            handleChangeImage({target: {files: []}})
                        }}
                    >
                        X
                    </div>
                ) : null
            }
        </figure>
    );
}
SingleImage.propTypes = {
    image: PropTypes.object.isRequired,
    obj: PropTypes.object.isRequired,
    handleChangeImage: PropTypes.func.isRequired,
}
export default SingleImage;
