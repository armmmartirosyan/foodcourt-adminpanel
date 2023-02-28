import React from 'react';
import {Map, YMaps} from "react-yandex-maps";
import YandexPlacemark from "./YandexPlacemark";
import PropTypes from "prop-types";
import _ from "lodash";

function YandexMap(props) {
    const {
        onMapClick = () => {},
        singleBranch={},
        branches = [],
        allowMapClick,
        center,
    } = props;

    return (
        <YMaps
            query={{
                ns: 'use-load-option'
            }}>
            <Map
                modules={["geocode"]}
                width="100%"
                height="100%"
                onClick={(e) => {
                    if (allowMapClick) onMapClick(e, 'map');
                }}
                state={{
                    center: !_.isEmpty(center) ? center : [40.234325, 44.497457],
                    zoom: 12,
                }}
            >
                {
                    branches?.length ? (
                        branches.map(branchObj => (
                            <YandexPlacemark
                                key={branchObj.id}
                                geometry={[branchObj.lat, branchObj.lon]}
                                id={branchObj.id}
                            />
                        ))
                    ) : null
                }
                {
                    singleBranch.id ? (
                        <YandexPlacemark
                            geometry={[+singleBranch.lat, +singleBranch.lon]}
                            slugName=''
                        />
                    ) : null
                }
            </Map>
        </YMaps>
    );
}
YandexMap.propTypes = {
    allowMapClick: PropTypes.bool.isRequired,
    center: PropTypes.array.isRequired,
    singleBranch: PropTypes.object,
    onMapClick: PropTypes.func,
    branches: PropTypes.array,
}

export default YandexMap;
