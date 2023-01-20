import React from 'react';
import {Map, YMaps} from "react-yandex-maps";
import YandexPlacemark from "./YandexPlacemark";

function YandexMap(props) {
    const {
        center = [],
        branches = [],
        singleBranch={},
        allowMapClick = false,
        onMapClick = () => {},
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
                    if (allowMapClick) onMapClick(e);
                }}
                defaultState={{
                    center: center.length ? center : [40.786543, 43.838250],
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

export default YandexMap;
