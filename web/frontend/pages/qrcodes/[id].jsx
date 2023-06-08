import { useParams } from "react-router-dom";
import { useAppQuery } from "../../hooks";

import React from 'react'

export default function qrCode() {
  const { id } = useParams();
  /*
    Fetch the QR code.
    useAppQuery uses useAuthenticatedQuery from App Bridge to authenticate the request.
    The backend supplements app data with data queried from the Shopify GraphQL Admin API.
  */
  const {
    data: QRCode,
    isLoading,
    isRefetching,
  } = useAppQuery({
    url: `/api/qrcodes/${id}`,
    reactQueryOptions: {
      /* Disable refetching because the QRCodeForm component ignores changes to its props */
      refetchOnReconnect: false,
    },
  });


  const onSubmit = useCallback(
    (body) => {
      (async () => {
        const parsedBody = body;
        parsedBody.destination = parsedBody.destination[0];
        const QRCodeId = QRCode?.id;
        /* construct the appropriate URL to send the API request to based on whether the QR code is new or being updated */
        const url = QRCodeId ? `/api/qrcodes/${QRCodeId}` : "/api/qrcodes";
        /* a condition to select the appropriate HTTP method: PATCH to update a QR code or POST to create a new QR code */
        const method = QRCodeId ? "PATCH" : "POST";
        /* use (authenticated) fetch from App Bridge to send the request to the API and, if successful, clear the form to reset the ContextualSaveBar and parse the response JSON */
        const response = await fetch(url, {
          method,
          body: JSON.stringify(parsedBody),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          makeClean();
          const QRCode = await response.json();
          /* if this is a new QR code, then save the QR code and navigate to the edit page; this behavior is the standard when saving resources in the Shopify admin */
          if (!QRCodeId) {
            navigate(`/qrcodes/${QRCode.id}`);
            /* if this is a QR code update, update the QR code state in this component */
          } else {
            setQRCode(QRCode);
          }
        }
      })();
      return { status: "success" };
    },
    [QRCode, setQRCode]
  );


  const [isDeleting, setIsDeleting] = useState(false);
  const deleteQRCode = useCallback(async () => {
    reset();
    /* The isDeleting state disables the download button and the delete QR code button to show the user that an action is in progress */
    setIsDeleting(true);
    const response = await fetch(`/api/qrcodes/${QRCode.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      navigate(`/`);
    }
  }, [QRCode]);


  return (
    <>
      <Page title="QR Code">
        <Layout>
          <Layout.Section>
            <Card>
              <Card.Section>
                <QRCodeForm
                  onSubmit={onSubmit}
                  initialValues={QRCode}
                  isLoading={isLoading || isRefetching}
                  isDeleting={isDeleting}
                  deleteQRCode={deleteQRCode}
                />
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  )
}
