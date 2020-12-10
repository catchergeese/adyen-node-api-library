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

import nock from "nock";
import { createClient } from "../__mocks__/base";
import Payouts from "../services/payouts";
import Client from "../client";
import StoreDetailRequest = IPayouts.StoreDetailRequest;
import { ApiConstants } from "../constants/apiConstants";

const isCI = process.env.CI === "true" || (typeof process.env.CI === "boolean" && process.env.CI);
const storeDetailAndSubmitThirdParty = JSON.stringify({
    additionalData: {
        fraudResultType: "GREEN",
        fraudManualReview: "false",
    },
    pspReference: "8515131751004933",
    resultCode: "[payout-submit-received]"
});

const storeDetail = JSON.stringify({
    pspReference: "8515136787207087",
    recurringDetailReference: "8415088571022720",
    resultCode: "Success"
});


const amountAndReference = {
    amount: {
        value: 100,
        currency: "EUR"
    },
    reference: "randomReference",
};

const defaultData = {
    dateOfBirth: (new Date()).toISOString(),
    nationality: "NL",
    shopperEmail: "johndoe@email.com",
    shopperReference: "shopperReference",
};

const mockStoreDetailRequest = (merchantAccount: string = process.env.ADYEN_MERCHANT!): IPayouts.StoreDetailRequest => ({
    ...defaultData,
    card: {
        cvc: "737",
        expiryMonth: "03",
        expiryYear: "2020",
        number: "4111111111111111",
        holderName: "John Smith"
    },
    entityType: "Company",
    recurring: {
        contract: "PAYOUT"
    },
    merchantAccount,
});

const mockSubmitRequest = (merchantAccount: string = process.env.ADYEN_MERCHANT!): IPayouts.SubmitRequest => ({
    selectedRecurringDetailReference: "LATEST",
    recurring: {
        contract: "PAYOUT"
    },
    ...defaultData,
    ...amountAndReference,
    merchantAccount,
});

const mockStoreDetailAndSubmitRequest = (merchantAccount?: string): IPayouts.StoreDetailAndSubmitRequest => ({
    ...amountAndReference,
    ...(mockStoreDetailRequest(merchantAccount)),
});

const mockPayoutRequest = (merchantAccount: string = process.env.ADYEN_MERCHANT!): IPayouts.PayoutRequest => ({
    ...amountAndReference,
    ...defaultData,
    card: {
        expiryMonth: "03",
        expiryYear: "2030",
        holderName: "John Smith",
        number: "4111111111111111",
    },
    merchantAccount,
});

let client: Client;
let clientStore: Client;
let clientReview: Client;
let payouts: Payouts;
let scope: nock.Scope;

beforeEach((): void => {
    if (!nock.isActive()) {
        nock.activate();
    }
    client = createClient();
    clientStore = createClient(process.env.ADYEN_STOREPAYOUT_APIKEY);
    clientReview = createClient(process.env.ADYEN_REVIEWPAYOUT_APIKEY);
    scope = nock(`${client.config.endpoint}/pal/servlet/Payout/${Client.API_VERSION}`);
    payouts = new Payouts(client);
});

afterEach((): void => {
    nock.cleanAll();
});

describe("PayoutTest", function (): void {
    test.each([isCI, true])("should succeed on store detail and submit third party, isMock: %p", async function (isMock): Promise<void> {
        !isMock && nock.restore();
        payouts = new Payouts(clientStore);
        const request: IPayouts.StoreDetailAndSubmitRequest = mockStoreDetailAndSubmitRequest();
        scope.post("/storeDetailAndSubmitThirdParty").reply(200, storeDetailAndSubmitThirdParty);

        const result = await payouts.storeDetailAndSubmitThirdParty.post(request);
        expect(result.resultCode).toEqual("[payout-submit-received]");
        expect(result.pspReference).toBeTruthy();
    });

    test.each([false, true])("should succeed on store detail, isMock: %p", async function (isMock): Promise<void> {
        !isMock && nock.restore();
        payouts = new Payouts(clientStore);
        scope.post("/storeDetail").reply(200, storeDetail);
        const request: StoreDetailRequest = mockStoreDetailRequest();
        const result = await payouts.storeDetail.post(request);

        expect("Success").toEqual(result.resultCode);
        expect(result.pspReference).toBeTruthy();
        expect(result.recurringDetailReference).toBeTruthy();
    });

    test.each([isCI, true])("should succeed on confirm third party, isMock: %p", async function (isMock): Promise<void> {
        !isMock && nock.restore();
        payouts = new Payouts(clientStore);
        scope.post("/storeDetail").reply(200, storeDetail);
        const storeRequest: StoreDetailRequest = mockStoreDetailRequest();
        const storeResult = await payouts.storeDetail.post(storeRequest);

        payouts = new Payouts(clientReview);
        scope.post("/confirmThirdParty")
            .reply(200, {
                pspReference: "8815131762537886",
                response: "[payout-confirm-received]"
            });

        const request: IPayouts.ModifyRequest = {
            merchantAccount: process.env.ADYEN_MERCHANT!,
            originalReference: storeResult.pspReference
        };
        const result = await payouts.confirmThirdParty.post(request);

        expect(result.response).toEqual("[payout-confirm-received]");
        expect(result.pspReference).toBeTruthy();
    });

    test.each([isCI, true])("should succeed on submit third party, isMock: %p", async function (isMock): Promise<void> {
        !isMock && nock.restore();
        payouts = new Payouts(clientStore);
        scope.post("/submitThirdParty").reply(200, storeDetailAndSubmitThirdParty);

        const request: IPayouts.SubmitRequest = mockSubmitRequest();
        const result = await payouts.submitThirdParty.post(request);

        expect(result.resultCode).toEqual("[payout-submit-received]");
        expect(result.pspReference).toBeTruthy();

        if (result.additionalData) {
            expect(result.additionalData[ApiConstants.FRAUD_RESULT_TYPE]).toEqual("GREEN");
            expect(result.additionalData[ApiConstants.FRAUD_MANUAL_REVIEW]).toEqual("false");
        }
    });

    test.each([false, true])("should succeed on decline third party, isMock: %p", async function (isMock): Promise<void> {
        !isMock && nock.restore();
        payouts = new Payouts(clientStore);
        scope.post("/storeDetail").reply(200, storeDetail);
        const storeRequest: StoreDetailRequest = mockStoreDetailRequest();
        const storeResult = await payouts.storeDetail.post(storeRequest);

        payouts = new Payouts(clientReview);
        const request: IPayouts.ModifyRequest = {
            merchantAccount: process.env.ADYEN_MERCHANT!,
            originalReference: storeResult.pspReference
        };
        scope.post("/declineThirdParty")
            .reply(200, {
                pspReference: "8815131762537886",
                response: "[payout-decline-received]"
            });
        const result = await payouts.declineThirdParty.post(request);

        expect(result.response).toEqual("[payout-decline-received]");
        expect(result.pspReference).toBeTruthy();
    });

    test.each([isCI, true])("should succeed on payout, isMock: %p", async function (isMock): Promise<void> {
        !isMock && nock.restore();
        scope.post("/payout").reply(200, {
            pspReference: "8815131762537886",
            resultCode: "Received",
        });

        const request = mockPayoutRequest();
        const result = await payouts.payout.post(request);

        expect(result.resultCode).toEqual("Received");
        expect(result.pspReference).toBeTruthy();
    });
});
