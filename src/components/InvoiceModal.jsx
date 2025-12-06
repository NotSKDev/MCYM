import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const GenerateInvoice = () => {
  const element = document.querySelector("#invoiceCapture");
  if (!element) return;

  html2canvas(element, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("invoice-001.pdf");
  });
};

const McDate = new Date().toLocaleDateString();

const InvoiceModal = ({
  showModal,
  closeModal,
  info,
  currency,
  total,
  items,
  taxAmount,
  discountAmount,
  subTotal,
}) => {
  return (
    <div>
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <div
          id="invoiceCapture"
          style={{
            fontSize: "11px",
            lineHeight: "14px",
            width: "100%",
          }}
        >
          <div
            className="d-flex flex-row justify-content-between align-items-start bg-light w-100"
            style={{ padding: "12px" }}
          >
            <div className="w-100">
              <h4 className="fw-bold my-1" style={{ fontSize: "16px" }}>
                {info.billFrom || "John Uberbacher"}
              </h4>
              <h6
                className="fw-bold text-secondary mb-0"
                style={{ fontSize: "11px" }}
              >
                ESTIMATED INVOICE
              </h6>
            </div>
          </div>

          <div style={{ padding: "12px" }}>
            <Row className="mb-2">
              <Col md={4}>
                <div className="fw-bold" style={{ fontSize: "11px" }}>
                  Billed From:
                </div>
                <div>{info.billFrom || ""}</div>
                <div>{info.billFromAddress || ""}</div>
              </Col>
              <Col md={4}>
                <div
                  className="fw-bold"
                  style={{ marginTop: "2px", fontSize: "11px" }}
                >
                  Date Of Issue:
                </div>
                <div>{McDate || ""}</div>
              </Col>
            </Row>

            <Table className="mb-0" bordered size="sm">
              <thead>
                <tr>
                  <th style={{ fontSize: "11px" }}>QTY</th>
                  <th style={{ fontSize: "11px" }}>DESCRIPTION</th>
                  <th className="text-end" style={{ fontSize: "11px" }}>
                    PRICE
                  </th>
                  <th className="text-end" style={{ fontSize: "11px" }}>
                    AMOUNT
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  return (
                    <tr id={i} key={i}>
                      <td style={{ width: "60px" }}>{item.quantity}</td>
                      <td>{item.name}</td>
                      <td
                        className="text-end"
                        style={{
                          width: "110px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {currency} {Number(item.price).toFixed(2)}
                      </td>
                      <td
                        className="text-end"
                        style={{
                          width: "110px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {currency} {Number(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Table bordered size="sm">
              <tbody>
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "90px" }}>
                    SUBTOTAL
                  </td>
                  <td
                    className="text-end"
                    style={{ width: "110px", whiteSpace: "nowrap" }}
                  >
                    {currency} {Number(subTotal).toFixed(2)}
                  </td>
                </tr>

                {taxAmount != 0.0 && (
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "90px" }}>
                      TAX
                    </td>
                    <td
                      className="text-end"
                      style={{ width: "110px", whiteSpace: "nowrap" }}
                    >
                      {currency} {Number(taxAmount).toFixed(2)}
                    </td>
                  </tr>
                )}

                {discountAmount != 0.0 && (
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "90px" }}>
                      DISCOUNT
                    </td>
                    <td
                      className="text-end"
                      style={{ width: "110px", whiteSpace: "nowrap" }}
                    >
                      {currency} {Number(discountAmount).toFixed(2)}
                    </td>
                  </tr>
                )}

                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "90px" }}>
                    TOTAL
                  </td>
                  <td
                    className="text-end"
                    style={{ width: "110px", whiteSpace: "nowrap" }}
                  >
                    {currency} {Number(total).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </Table>

            {info.notes && (
              <div
                className="bg-light rounded"
                style={{
                  padding: "6px 10px",
                  fontSize: "11px",
                }}
              >
                {info.notes}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "12px" }}>
          <Row>
            <Col md={6}></Col>
            <Col md={6}>
              <Button
                variant="outline-primary"
                className="d-block w-100"
                style={{ fontSize: "12px", padding: "6px 0" }}
                onClick={GenerateInvoice}
              >
                <BiCloudDownload
                  style={{ width: "13px", height: "13px", marginTop: "-2px" }}
                  className="me-2"
                />
                Download Copy
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceModal;
