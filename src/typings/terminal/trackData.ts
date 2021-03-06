/*
 *                       ######
 *                       ######
 * ############    ####( ######  #####. ######  ############   ############
 * #############  #####( ######  #####. ######  #############  #############
 *        ######  #####( ######  #####. ######  #####  ######  #####  ######
 * ###### ######  #####( ######  #####. ######  #####  #####   #####  ######
 * ###### ######  #####( ######  #####. ######  #####          #####  ######
 * #############  #############  #############  #############  #####  ######
 *  ############   ############  #############   ############  #####  ######
 *                                      ######
 *                               #############
 *                               ############
 * Adyen NodeJS API Library
 * Copyright (c) 2020 Adyen B.V.
 * This file is open source and available under the MIT license.
 * See the LICENSE file for more info.
 */

/**
 * Terminal API
 * Definition of Terminal API Schema
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */



export class TrackData {
    "trackFormat"?: TrackData.TrackFormatEnum;
    "trackNumb"?: number;
    "value"?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: {name: string, baseName: string, type: string}[] = [
        {
            "name": "trackFormat",
            "baseName": "TrackFormat",
            "type": "TrackData.TrackFormatEnum"
        },
        {
            "name": "trackNumb",
            "baseName": "TrackNumb",
            "type": "number"
        },
        {
            "name": "value",
            "baseName": "Value",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return TrackData.attributeTypeMap;
    }
}

export namespace TrackData {
    export enum TrackFormatEnum {
        AAMVA = "AAMVA" as any,
        CMC7 = "CMC-7" as any,
        E13B = "E-13B" as any,
        ISO = "ISO" as any,
        JISI = "JIS-I" as any,
        JISII = "JIS-II" as any
    }
}
