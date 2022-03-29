import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";

import EmptyBox from "../../../others/EmptyBox";

import { GET_PAYMENT_TYPES } from "../../../../graphql/queries/paymentType.queries";
import { UPDATE_PAYMENT_TYPE } from "../../../../graphql/mutations/paymentType.mutations";

export const ListingPaymentTypes = () => {
  const { data } = useQuery(GET_PAYMENT_TYPES);

  const [updatePaymentType, { loading: updating }] = useMutation(
    UPDATE_PAYMENT_TYPE,
    {
      refetchQueries: [{ query: GET_PAYMENT_TYPES }],
    }
  );

  const deletePaymentType = (payment) => {
    updatePaymentType({
      variables: {
        paymentType: { name: payment.name, deleted: true, active: false },
        id: payment.id,
      },
    })
      .then((res) => {
        const { updatePaymentType } = res.data;
        if (updatePaymentType?.id) {
          toast.success(updatePaymentType?.message);
        } else {
          toast.error(updatePaymentType?.message);
        }
      })
      .catch((err) => {
        console.log(`[ERROR] ${err}`);
      });
  };

  const changeStatePaymentType = (payment) => {
    updatePaymentType({
      variables: {
        paymentType: { name: payment.name, active: !payment.active },
        id: payment.id,
      },
    })
      .then((res) => {
        const { updatePaymentType } = res.data;
        if (updatePaymentType?.id) {
          toast.success(updatePaymentType?.message);
        } else {
          toast.error(updatePaymentType?.message);
        }
      })
      .catch((err) => {
        console.log(`[ERROR] ${err}`);
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="header_list">
            <div className="row">
              <div className="col-4">Tipo de Pago</div>
              <div className="col-3">Estado</div>
              <div className="col-3">Detalles</div>
              <div className="col text-right">Acciones</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {data?.paymentTypes.length === 0 && (
          <div className="col">
            <EmptyBox to="/panel/configuracion/tipo-pago/nuevo" />
          </div>
        )}

        {data?.paymentTypes?.map((payment, index) => {
          var createdAt = new Date(parseInt(payment.createdAt));
          var updatedAt = new Date(parseInt(payment.updatedAt));
          if (!payment.deleted)
            return (
              <div className="col-12" key={payment.id}>
                <div className="user_item mb-3">
                  <div className="row align-items-center">
                    <div className="col-4">
                      <span className="name">{payment.name}</span>
                    </div>
                    <div className="col-3">
                      <span
                        className={`badge badge-${
                          payment.active ? "success" : "danger"
                        }`}
                      >
                        {payment.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="col-3">
                      <div className="timestamp">
                        Creado el:{" "}
                        <span>{`${createdAt.getDate()}/${createdAt.getMonth()}/${createdAt.getFullYear()}`}</span>
                      </div>
                      <div className="timestamp">
                        Modificado el:{" "}
                        <span>{`${updatedAt.getDate()}/${updatedAt.getMonth()}/${updatedAt.getFullYear()}`}</span>
                      </div>
                    </div>
                    <div className="col">
                      <div className="options text-right">
                        <Link
                          to={`/panel/configuracion/tipo-pago/modificar/${payment.id}`}
                        >
                          <button
                            type="button"
                            className="btn btn-secondary mr-2"
                          >
                            <i className="bi bi-pencil-fill" />
                          </button>
                        </Link>

                        <button
                          type="button"
                          className="btn btn-secondary mr-2"
                          onClick={(e) => changeStatePaymentType(payment)}
                          disabled={updating}
                        >
                          <i className="bi bi-toggles" />
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={(e) => deletePaymentType(payment)}
                          disabled={updating}
                        >
                          <i className="bi bi-trash-fill" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          else return null;
        })}
      </div>
    </>
  );
};
