import React from 'react';
import _ from "lodash";
import PropTypes from "prop-types";

const {REACT_APP_API_URL} = process.env;

function SingleImage(props) {
    const {image, obj, handleChangeImage} = props;

    return (
        <figure className='image-container'>
            <img
                src={
                    !_.isEmpty(image) ? image._src
                        : `${REACT_APP_API_URL}/${obj.imagePath}`
                }
                alt="image"
                className='image'
            />
            {
                !_.isEmpty(image) && image.type && handleChangeImage ? (
                    <div
                        className="image-delete"
                        onClick={() => {
                            handleChangeImage({target: {files: []}}, 'image')
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
    handleChangeImage: PropTypes.func,
}
export default SingleImage;
