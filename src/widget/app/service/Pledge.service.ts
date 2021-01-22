import {Injectable} from "@angular/core"
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http"
import { Observable } from "rxjs";
import {ConstantsGlobal} from "../Constants-Global"
import {CookieService} from "./Cookie.service"

@Injectable()
export class PledgeService {
  authToken: string;
  
  constructor(private http: Http) {
    this.refreshAuthToken();
  }

  /**
   * Grab auth token from the cookie
   */
  refreshAuthToken() {
    this.authToken = CookieService.getThrinaciaSedraAccount() ? CookieService.getThrinaciaSedraAccount() : CookieService.getAuth();
  }

  /**
   * Get Stripe account
   * @return {Promise}
   */
  pledge(pledgeInfo, campaign_id, stripe_pledge, stripe_tip){

    //make compatible with error handling in PledgeCampaignCtrl
    var failed = {
      data: {
        code: 'payment_failed'
      }
    }

    pledgeInfo.use_sca = 1;

    let postData = (data) => {
      return {
        method: 'POST', 
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    }

    return new Promise((resolve, reject) => {
      fetch(ConstantsGlobal.getApiUrlCampaign()+campaign_id+'/pledge', postData(pledgeInfo)).then(res => res.json()).then(
        success => {
        var successful_pledge: any = success;
        // pledge and tip authentication
        if(success.payment_intent_status == "requires_action" && success.payment_intent_status_tip == "requires_action"){
          stripe_pledge.handleCardAction(success.payment_intent_client_secret).then(function(pi){
            if(pi.error){
              reject(failed);
            }
            fetch(ConstantsGlobal.getApiUrl()+'account/stripe/payment-intent-direct/confirm/'+success.charge_id,
            postData({stripe_transaction_id: success.stripe_transaction_id, entry_id: campaign_id})).then(res => res.json()).then((res) => {
              if(res.status != '200'){
                reject(failed);
              }
              stripe_tip.handleCardAction(success.payment_intent_client_secret_tip).then(function(pi_tip){
                if(pi_tip.error){
                  successful_pledge.amount_tip = 0;
                  resolve(successful_pledge);
                } else {
                  fetch(ConstantsGlobal.getApiUrl()+'account/stripe/payment-intent-direct/confirm/'+success.charge_id_tip, 
                  postData({stripe_transaction_id: success.stripe_transaction_id, entry_id: campaign_id, tip_transaction: 1})).then(res => res.json()).then((res) => {
                    if(res.status != '200'){
                      reject(failed);
                    }
                    resolve(successful_pledge);
                  }).catch(error => {
                    reject(failed);
                  });
                }
              }).catch(function(){
                reject(failed);
              }); 
            }).catch(error => {
              reject(failed);
            })
          }).catch(function(){
            reject(failed);
          }) 
        }
        // stripe 3D secure pledge authenticiation
        else if(success.payment_intent_status == "requires_action"){
          stripe_pledge.handleCardAction(success.payment_intent_client_secret).then(function(pi){
            if(pi.error){
              reject(failed);
            } else {
              let url = ConstantsGlobal.getApiUrl()+'account/stripe/payment-intent-direct/confirm/'+success.charge_id;
              let data = { stripe_transaction_id: success.stripe_transaction_id, entry_id: campaign_id };
              console.log(data);
              fetch(url, postData(data)).then(res => res.json()).then(
                res => {
                  if(res.status != '200'){
                    reject(failed);
                  }
                  resolve(successful_pledge);
                }).catch( error => {
                  reject(failed)
              });
            }
          }).catch(function(){
            reject(failed);
          });
        }
        //tip authentication
        else if(success.payment_intent_status_tip == "requires_action"){
          stripe_tip.handleCardAction(success.payment_intent_client_secret_tip).then(function(pi_tip){
            if(pi_tip.error){
              successful_pledge.amount_tip = 0;
              resolve(successful_pledge);
            } else {
              fetch(ConstantsGlobal.getApiUrl()+'account/stripe/payment-intent-direct/confirm/'+success.charge_id_tip,
              postData({stripe_transaction_id: success.stripe_transaction_id, entry_id: campaign_id, tip_transaction: 1})).then(res => res.json()).then((res) => {
                if(res.status != '200'){
                  reject(failed);
                }
                resolve(successful_pledge);
              }).catch(error => {
                reject(failed);
              });
            }
          }).catch(function(){
            reject(failed);
          });
        } else {
          resolve(successful_pledge);
        }
      }).catch(error => {
        reject()
      });
    });
  }
}
