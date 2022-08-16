import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AllAccountsController.getAccounts';
import getNotes from '@salesforce/apex/AccountNotesController.getNotes';
import getAccountIDVF from '@salesforce/apex/accountforVF.getAccountIdVF';

import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import downloadjs from '@salesforce/resourceUrl/downloadjs';
import downloadPDF from '@salesforce/apex/AccountNotesController.getPdfFileAsBase64String';
    

export default class NotesComponent extends LightningElement {
    @track boolPDF = true;
    @track value = '';
    @track optionsArray = [];
    arraNote = [];
    @track arrayNotesTrack = [];

    currentPage =1
    recordSize = 10
    totalPage = 0
    
    get options(){
        return this.optionsArray;
    }

    get records(){
        return this.visibleRecords
    }

    columns = [
        { label: 'Title', fieldName: 'Title', type: 'text' },
        { label: 'Body', fieldName: 'Body', type: 'text' },
        { label: 'Name', fieldName: 'CreatedByName', type: 'text' },
        { label: 'Type', fieldName: 'ParentType', type: 'text' },
    ];

    renderedCallback() {
        loadScript(this, downloadjs)
        .then(() => console.log('Loaded download.js'))
        .catch(error => console.log(error));
    }

    //GetAccounts
    connectedCallback(){
        getAccounts().then(response=>{
            let arra = [];
            for (var i = 0; i < response.length; i++) {
                arra.push({ label : response[i].Name, value : response[i].Id });              
            }

            this.optionsArray = arra;
        })       
    }

    handleChangedValue(event){
        this.arraNote = [];
        this.value = event.detail.value;

        // getAccountIDVF({accountId:this.value}).then(response =>{
        //     console.log(response);
        // });      
        
        getNotes({accountId:this.value}).then(response=>{
            for (var i = 0; i < response.length; i++) {
                this.arraNote.push({Id:response[i].Id,Title:response[i].Title,Body:response[i].Body,
                    CreatedByName:response[i].CreatedBy.Name,ParentType:response[i].Parent.Type})
            }
            
            if(this.arraNote.length> 0){
                this.boolPDF = false;
            }else{
                this.boolPDF = true;
            }

            this.arrayNotesTrack = this.arraNote;                 
            this.recordSize = Number(this.recordSize);
            this.totalPage = Math.ceil(this.arrayNotesTrack.length/this.recordSize);
            this.updateRecords();
        });        
    };

    get disablePrevious(){ 
        return this.currentPage<=1;
    }
    get disableNext(){ 
        return this.currentPage>=this.totalPage;
    }

    get disablePDF(){
        return this.boolPDF;
    }

    previousHandler(){ 
        if(this.currentPage>1){
            this.currentPage = this.currentPage-1;
            this.updateRecords();
        }
    }
    nextHandler(){
        if(this.currentPage < this.totalPage){
            this.currentPage = this.currentPage+1;
            this.updateRecords();
        }
    }

    updateRecords(){ 
        const start = (this.currentPage-1)*this.recordSize;
        const end = this.recordSize*this.currentPage;

        this.arrayNotesTrack = this.arraNote.slice(start, end);
    }

    /////PDF//////

    boolShowSpinner = false;
    pdfString;
    generatePdf(){

        this.boolShowSpinner = true;
        downloadPDF({}).then(response => {
            this.boolShowSpinner = false;
            var strFile = "data:application/pdf;base64,"+response;
            window.download(strFile, "sample.pdf", "application/pdf");

        }).catch(error => {
            console.log('Error: ' +error.body.message);
        });
    }

    //////////////
}