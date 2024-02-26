import { LightningElement, wire, api, track } from 'lwc';
import {getRecord, getFieldValue } from 'lightning/uiRecordApi';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

export default class GiphyDisplay extends LightningElement {

    giphyUrl = '';
    @api recordId;
    @track INDUSTRY_FIELD;
    accountIndustryValue='';
    accountIndustryOnLoad = true;

    @wire(getRecord, {recordId: '$recordId', fields: ['Account.Industry']})
    updateGifOnIndustryFieldChange({data}){
        if(data){
            //inital load
            if(this.accountIndustryOnLoad==true){
                this.accountIndustryValue = getFieldValue(data, INDUSTRY_FIELD);
                this.accountIndustryOnLoad = false;
                this.getGiphy(this.accountIndustryValue);
            }
            let accountIndustry = getFieldValue(data, INDUSTRY_FIELD);
            //i have changed so get a new giphy and set it to the new industry
            if(accountIndustry != this.accountIndustryValue){
                this.getGiphy(accountIndustry);
                this.accountIndustryValue = accountIndustry; 
            }
        }
    }

    getGiphy(industryTag){
        return fetch('https://api.giphy.com/v1/gifs/random?api_key=rlyv9o1o3vWQRGUk2ANKbVYfNXY2CMAB&tag=' + 
        industryTag + '&rating=g', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        
        }).then(response => response.json())
        .then(data => {
            this.giphyUrl=data.data.fixed_height_downsampled_url;
            })
    }

}