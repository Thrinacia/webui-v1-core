//TODO Clean up function that requires campaign id as argument, we can grab it from ConstatnsGlobal
import { Injectable, Inject } from "@angular/core";
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { ConstantsGlobal } from "../Constants-Global";
import { CookieService } from "./Cookie.service";
import { StripeService } from "./Stripe.service";

@Injectable()
export class CampaignService {
  ANONYMOUS_CONTIBUTION = "anonymous";
  ANONYMOUS_CONTIBUTION_PARTIAL = "partial_anonymous";
  res: any;
  campaignId: number;
  authToken: string;
  mStripeService: StripeService;

  constructor(private http: Http, @Inject(StripeService) stripeService: StripeService) {
    this.refreshAuthToken();
    this.mStripeService = stripeService;
  }

  /**
   * Grab auth token from the cookie
   */
  refreshAuthToken() {
    this.authToken = CookieService.getAuth();
  }

  getAuthOptions(authToken?: string, search?: URLSearchParams) {
    if (authToken) {
      let headers = new Headers();
      headers.append("X-Auth-Token", authToken);
      let options = new RequestOptions({
        headers: headers,
        search: search
      });
      return options;
    } else {
      return null;
    }
  }

  /**
   * Get campaign data through the API
   * @return {Observable} An observable that function can subscribe to
   */
  getCampaignData(campaignId: number, authToken?: string) {
    this.campaignId = campaignId;
    let campaignUrl = ConstantsGlobal.getApiUrlCampaign() + campaignId;

    return this.http.get(campaignUrl, this.getAuthOptions(authToken))
      .map(res => res.json());
  }

  /**
   * Get campaign data through the API
   * @return {Observable} An observable that function can subscribe to
   */
  getCouponData(campaignId: number, couponCode: string, pledgeLevelId: number, authToken?: string) {
    let campaignUrl = ConstantsGlobal.getApiUrlCampaign() + campaignId +"/coupon?code="+couponCode+"&pledge_level_id="+pledgeLevelId;

    return this.http.get(campaignUrl, this.getAuthOptions(authToken))
      .map(res => res.json());
  }

  getCampaignAllData(campaignFilters?: Object) {
    let campaignUrl = ConstantsGlobal.getApiUrlCampaign();
    let urlParam = new URLSearchParams();
    if (campaignFilters) {
      urlParam.append("filters", JSON.stringify(campaignFilters));
    }
    return this.http.get(campaignUrl, this.getAuthOptions(this.authToken, urlParam))
      .map(res => res.json());
  }

  /**
   * get campaign stream
   * @param  {number}     campaignId campaign id
   * @return {Observable}            response
   */
  getCampaignStream(campaignId: number) {
    let campaignStreamUrl = ConstantsGlobal.getApiUrlCampaign() + campaignId + "/stream";
    return this.http.get(campaignStreamUrl, this.getAuthOptions(this.authToken))
      .map(res => res.json());
  }

  /**
   * get campaign backers
   * @param  {number}     campaignId campaign id
   * @return {Observable}            response
   */
  getCampaignBackers(campaignId: number) {
    let campaignBackerUrl = ConstantsGlobal.getApiUrlCampaign() + campaignId + "/backer/";
    return this.http.get(campaignBackerUrl, this.getAuthOptions(this.authToken))
      .map(res => res.json());
  }

  /**
   * Create campaign contribution
   * @param  {number} campaignId      The campaign id
   * @param  {Object} pledgeParam     parameters for pledge
   * @return {Observable}             Observable
   */
  pledge(campaignId: number, pledgeParam: Object) {
    let API_URL_CAMPAIGN_PLEDGE = ConstantsGlobal.getApiUrlCampaign() + campaignId + "/pledge/";

    return this.http.post(API_URL_CAMPAIGN_PLEDGE, JSON.stringify(pledgeParam), pledgeParam.hasOwnProperty("inline_token") ? null : this.getAuthOptions(this.authToken))
      .map(res => res.json());
  }

  pledgeAsGuest(campaignId: number, pledgeParam: Object) {
    let API_URL_CAMPAIGN_PLEDGE_GUEST = ConstantsGlobal.getApiUrlCampaign() + campaignId + "/pledge/guest/";
    let guestPledgeParam = {};
    for (let prop in pledgeParam) {
      guestPledgeParam[prop] = pledgeParam[prop];
    }
    return this.http.post(API_URL_CAMPAIGN_PLEDGE_GUEST, JSON.stringify(pledgeParam))
      .map(res => res.json());
  }

  /**
   * Get campaigns created by current logged-in user
   * @return {Observable}
   */
  getCampaignManagement() {
    let campaignManagementUrl = ConstantsGlobal.getApiUrlCampaignManagement();
    return this.http.get(campaignManagementUrl)
      .map(res => res.json());
  }

  /**
   * Check campaign status
   * @param  {number}     campaignId id of campaign
   * @return {Observable}
   */
  getCampaignStatus(campaignId: number) {
    let campaignBackerUrl = ConstantsGlobal.getApiUrlCampaign() + campaignId + "/status-check/";
    return this.http.get(campaignBackerUrl)
      .map(res => res.json());
  }

  getCampaignPledgeHistory(campaignId: number) {
    let campaignPledgeHistoryUrl = ConstantsGlobal.getApiUrlCampaign() + campaignId + "/pledge/";
    return this.http.get(campaignPledgeHistoryUrl, this.getAuthOptions(this.authToken))
      .map(res => res.json());
  }

}
