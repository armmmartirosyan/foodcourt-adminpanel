import React from 'react';
import PropTypes from "prop-types";

const {REACT_APP_API_URL} = process.env;

function ImagesList(props) {
    const {image = {}, handleDeleteImage} = props;

    return (
        <figure
            className='image-container'
            key={image._src || image.id}
        >
            <img
                src={image._src || `${REACT_APP_API_URL}/${image.name}`}
                alt="image"
                className='image'
            />
            {
                image.name ? (
                    <div
                        className="image-delete"
                        onClick={() => {
                            handleDeleteImage({src: image._src, name: image.name})
                        }}
                    >
                        X
                    </div>
                ) : null
            }
        </figure>
    );
}

ImagesList.propTypes = {
    image: PropTypes.object,
    handleDeleteImage: PropTypes.func.isRequired,
}

export default ImagesList;
