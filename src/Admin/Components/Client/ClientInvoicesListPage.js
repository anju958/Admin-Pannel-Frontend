import { useParams } from "react-router-dom";
import ClientInvoicesList from "./ClientInvoicesList";

function ClientInvoicesListPage() {
  const { clientId } = useParams();
  return <ClientInvoicesList clientId={clientId} />;
}

export default ClientInvoicesListPage;
