interface IFetchStore{
  didInvalidate?: boolean;
  data: any[];
}

declare interface PaymentReceiptFormStore extends IFetchStore{
  data: PaymentReceiptFormData[]
}

declare interface PaymentReceiptFormData {
  id?: PaymentReceiptItemId;
  organization: OrganizationInfoData;
  receiptNumber: number;
  series: string;
  fname: string;
  lname: string;
  patronymic: string;
  phone: string;
  priceList: PriceListEntry[];
  date: string;
}

declare interface OrganizationInfoStore extends IFetchStore{
  data: OrganizationInfoData[];
}

declare interface OrganizationInfoData{
  id: OrganizationId;
  name?: string;
  address?: string;
  INN?: string;
  ORGN?: string;
}

declare interface PriceListEntry {
    service: ServiceData;
    price: PriceRub;
}

declare interface ServiceStore extends IFetchStore{
  data: ServiceData[];
}

declare interface ServiceData{
  id: ServiceId;
  name?: string;
  price?: number;
}

declare type PaymentReceiptItemId = number;
declare type OrganizationId = number;
declare type ServiceId = number;
declare type PriceRub = number;
