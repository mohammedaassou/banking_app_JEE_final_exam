export interface AccountDetails {
  accountId:            string;
  balance:              number;
  currentPage:          number;
  totalPages:           number;
  pageSize:             number;
  accountOperationDTOS: AccountOperation[];
}

export interface AccountOperation {
  id:            number;
  operationDate: Date;
  amount:        number;
  type:          string;
  description:   string;
}

export interface BankAccountDTO {
  id?: string;
  accountId?: string;
  type?: string;
  balance?: number;
  createdAt?: string | Date;
  status?: string;
  customerDTO?: { id?: number; name?: string; email?: string };
}