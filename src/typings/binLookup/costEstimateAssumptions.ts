/**
 * Adyen BinLookup Service
 * The BIN Lookup API provides endpoints for retrieving information, such as [cost estimates](https://docs.adyen.com/features/cost-estimation), and 3D Secure supported version based on a given [BIN](https://docs.adyen.com/payments-basics/payment-glossary#bankidentificationnumberbin).
 *
 * OpenAPI spec version: 40
 * Contact: support@adyen.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface CostEstimateAssumptions { 
    /**
     * If true, the cardholder is expected to successfully authorise via 3D Secure.
     */
    assume3DSecureAuthenticated?: boolean;
    /**
     * If true, the transaction is expected to have valid Level 3 data.
     */
    assumeLevel3Data?: boolean;
    /**
     * If not zero, the number of installments.
     */
    installments?: number;
}