import React from 'react';
import {Placemark} from "react-yandex-maps";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";

function YandexPlacemark(props) {
    const {geometry, id} = props;
    const navigate = useNavigate();

    return (
        <Placemark
            defaultGeometry={geometry}
            onClick={() => {
                if (id) navigate(`/maps/${id}`);
            }}
            options={{
                preset: 'islands#geolocationIcon',
                iconColor: 'red',
            }}
        />
    );
}

YandexPlacemark.propTypes = {
    geometry: PropTypes.array.isRequired,
    id: PropTypes.number,
}

export default YandexPlacemark;
