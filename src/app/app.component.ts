import { FormsModule } from "@angular/forms";
import { Component, OnInit, Query } from "@angular/core";
import { PaymentRequest } from "./paymentRequest";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  isInvalidUrl: boolean = false;
  result: string;
  orginalUrl: string = "";
  queryString: string;
  isUrlValid: boolean = true;
  baseUrl: string;
  generatedUrl: string;
  objectKeys = Object.keys;
  allTheKeys: string[];
  isUrlParsed: boolean = false;
  paymentRequest: PaymentRequest = new PaymentRequest();
  referenceObj: PaymentRequest = new PaymentRequest();
  refrenceKeys: string[];

  onParse = () => {
    if (!this.isValidURL()) this.onClear();
    else {
      this.orginalUrl = this.orginalUrl.trim().toLowerCase();
      this.updateTableFromUrl();
      this.isUrlParsed = true;
    }
  };

  parseQuerystring = () => {
    var search = this.queryString.substring(0);
    var result = JSON.parse(
      '{"' +
        decodeURI(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    );
    return result;
  };

  updateTableFromUrl = () => {
    this.baseUrl = this.orginalUrl.split("?")[0];
    this.queryString = this.orginalUrl.split("?")[1];
    this.paymentRequest = this.parseQuerystring();
    this.allTheKeys = this.objectKeys(this.paymentRequest);
    this.refrenceKeys = this.objectKeys(this.referenceObj);
  };

  onGenerateUrl = () => {
    if (!this.isValidURL()) this.onClear();
    var esc = encodeURIComponent;
    var queryString = Object.keys(this.paymentRequest)
      .map(k => esc(k) + "=" + esc(this.paymentRequest[k]))
      .join("&");
    this.generatedUrl = this.baseUrl + "?" + queryString;
  };

  onClear = () => {
    this.orginalUrl = this.generatedUrl = this.baseUrl = "";
    this.isUrlParsed = false;
    return;
  };

  isValidURL = () => {
    var a = document.createElement("a");
    a.href = this.orginalUrl;
    var result = a.host && a.host != window.location.host;
    if (!result) this.isInvalidUrl = true;
    else this.isInvalidUrl = false;
    return result && this.orginalUrl;
  };
}
