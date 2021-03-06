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

import Client from "../../../client";
import getJsonResponse from "../../../helpers/getJsonResponse";
import Service from "../../../service";
import Resource from "../../resource";

class PaymentLinks extends Resource {
    public constructor(service: Service) {
        super(
            service,
            `${service.client.config.checkoutEndpoint}/${Client.CHECKOUT_API_VERSION}/paymentLinks`,
        );
    }

    public post(paymentLinkRequest: ICheckout.CreatePaymentLinkRequest): Promise<ICheckout.PaymentLinkResource> {
        return getJsonResponse.call<PaymentLinks, [ICheckout.CreatePaymentLinkRequest], Promise<ICheckout.PaymentLinkResource>>(
            this,
            paymentLinkRequest
        );
    }

    public get(linkId: string): Promise<ICheckout.PaymentLinkResource> {
        this.params = `/${linkId}`;
        return getJsonResponse.call<PaymentLinks, [{}, { method: string }], Promise<ICheckout.PaymentLinkResource>>(
            this,
            {},
            { method: "GET" }
        );
    }

    public patch(linkId: string, status: "expired"): Promise<ICheckout.PaymentLinkResource> {
        this.params = `/${linkId}`;
        return getJsonResponse.call<PaymentLinks, [{}, { method: string }], Promise<ICheckout.PaymentLinkResource>>(
            this,
            { status },
            { method: "PATCH" }
        );
    }
}

export default PaymentLinks;
