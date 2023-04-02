import classNames from "classnames";
import Link from "next/link";
import React, { useState } from "react";
import { FiUsers } from "react-icons/fi";
import {
  formatNumber,
  getPerfColor,
  MOTE_VALUE,
  truncateString,
} from "../../../utils/Utils";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Table from "../Table/Table";
import { useGetStatusInfos } from "../../../hooks/useGetStatusInfos";
import { useGetAllValidators } from "../../../hooks/useGetAllValidators";
import { useGetHistoryCasperPrice } from "../../../hooks/useGetHistoryCasperPrice";

const ValidatorsList = () => {
  const statusInfos = useGetStatusInfos();
  const [isLoading, setIsLoading] = useState(true);
  const era = statusInfos.data?.result.last_added_block_info.era_id || 0;
  const validators = useGetAllValidators(era);
  const price = useGetHistoryCasperPrice(1);
  const casperPrice = price.data?.prices[price.data?.prices.length - 1][1] || 0;

  // Error state
  if (validators.error && !validators.isLoading) {
    return <ErrorMessage />;
  }

  const headers = [
    "Rank",
    "Validator",
    "Fees",
    "Delegators",
    "Self stake",
    "% network",
    "Total stake",
    "Performance",
  ];

  const rows = validators.data?.data?.map(item => {
    return [
      <span className="flex items-center space-x-2 text-sm">{item.rank}</span>,
      <Link
        className="flex items-center space-x-4 hover:underline"
        href={`/validator/${item.public_key}?tab=delegators`}
      >
        <img
          className="w-8 h-8 rounded-full"
          src={
            item.account_info?.info.owner.branding.logo.png_256 ||
            `https://avatars.dicebear.com/api/identicon/:${
              item?.public_key.slice(13) ?? ""
            }.svg`
          }
        />
        <div className="">
          <p className="text-gray-700 hover:text-gray-900">
            {item.account_info?.info.owner.name}
          </p>
          <p className="text-sm text-gray-400">
            {truncateString(item.public_key, 10)}
          </p>
        </div>
      </Link>,
      <span className="flex items-center space-x-2 text-sm">{item.fee}%</span>,
      <div className="flex items-center space-x-2">
        <span>{item.delegators_number}</span>{" "}
        <FiUsers className="w-3 text-gray-400" />
      </div>,

      <p className="text-gray-400">{item.self_share}%</p>,
      <p className="text-gray-400">{item.network_share}%</p>,
      <div>
        <span className="flex items-center space-x-2">
          <span className="text-gray-800 text-md">
            {formatNumber(
              Number(Number(Number(item.total_stake) / MOTE_VALUE).toFixed(0))
            )}
          </span>
          <img
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDEuNTMgMjc2Ljk1Ij48ZyBkYXRhLW5hbWU9IkxheWVyIDIiPjxwYXRoIGQ9Ik0yMjcuNTggMjE0LjFhMTQgMTQgMCAwMC0xMy42MyAxMWwtNTIuNjYtMi41NGEyMC4wNiAyMC4wNiAwIDAwLjI2LTMgMTkuNDEgMTkuNDEgMCAwMC0uNzctNS4zN2wxOS4xMi0xMWExNCAxNCAwIDAwMTQgNC43NSAxMy44MSAxMy44MSAwIDAwMTAuNDctMTAuODEgMTQgMTQgMCAxMC0yNi4xMSAzLjUxbC0xOC41NiAxMC42OWExOS4zOSAxOS4zOSAwIDAwLTM1LjgxIDE0Ljc2bC0zNC4zNyA4LjQxQTE5LjM4IDE5LjM4IDAgMDA4NCAyMjJsNi4yLTguNTlhMTQgMTQgMCAwMDE4LjItMTAuOTEgMTQgMTQgMCAxMC0yMSA5LjZsLTUuNjggNy45YTE4Ljg3IDE4Ljg3IDAgMDAtMTQuMS0zLjY2bC01Ljk0LTMzLjg0YTE5LjQgMTkuNCAwIDEwLTEzLjIxLTM2LjEyTDMzLjUyIDExNy4yYTE5LjQgMTkuNCAwIDAwNy43NC03LjFsMTIuNCAzLjI3YTEzLjQgMTMuNCAwIDAwLS4xNiAyIDE0IDE0IDAgMTAuOTEtNC45NGwtMTEuNzEtMy4xYTE5LjI0IDE5LjI0IDAgMDAxLjQ5LTcuNDUgMTkgMTkgMCAwMC0uNTgtNC42MWwzNC40Ni0xNS44M2ExOS4zOSAxOS4zOSAwIDAwMzEuNS0yMi41bDIyLjA5LTIxLjU0YTE5LjIgMTkuMiAwIDAwOSAzdjkuOTJhMTMuOCAxMy44IDAgMTAzIDB2LTkuNmExOS4zOSAxOS4zOSAwIDAwNy44Ni0yLjM0TDE3NS42NyA2NGExOS40MSAxOS40MSAwIDEwMzMuNjggNS4xNmw3LjUzLTQuMjRhMTQgMTQgMCAxMC0xLjY5LTIuNTNsLTcuMDcgNGExOS4zOSAxOS4zOSAwIDAwLTMwLjQyLTQuNjZMMTU0IDM0LjY5YTE5LjY2IDE5LjY2IDAgMDA1LjU0LTYuODhsMjAuNzIgMy40NWExMy45NCAxMy45NCAwIDEwLS4zNC0zLjEzbC0xOS4yNi0zLjJhMTkuNCAxOS40IDAgMTAtMzEuNTEgOC45MkwxMDcuNzIgNTQuOGExOS4zMiAxOS4zMiAwIDAwLTEzLjA5LTYuNThWMzMuNTVhMTMuOCAxMy44IDAgMTAtMyAwVjQ3LjlhMTkuMzYgMTkuMzYgMCAwMC0xNS4yOSAyOUw0Mi42OCA5Mi4zOGExOS41OSAxOS41OSAwIDAwLTUuNTQtNy40NUw1MC4zMiA2MS4zYTEzLjIxIDEzLjIxIDAgMDA5LS43MSAxNC4xMyAxNC4xMyAwIDAwOC40Ni0xMS40MSAxNCAxNCAwIDEwLTIwLjI4IDExbC0xMi44MiAyM2ExOS40IDE5LjQgMCAxMC0zLjkzIDM1LjE3TDQ1LjkgMTQ4YTE5LjQyIDE5LjQyIDAgMDAtNy40NiAxMS42NmwtMTEtMy4yNGExMy4wNSAxMy4wNSAwIDAwLS44Mi05IDE0LjE2IDE0LjE2IDAgMDAtMTEuNDYtOC4zMiAxNCAxNCAwIDEwMTEuMjIgMjAuMTdsMTEuNyAzLjQ1di44NWExOS4zNyAxOS4zNyAwIDAwOC45IDE2LjNsLTcuNTEgOS44NWExNCAxNCAwIDEwMi4wNSAyLjI4bDguMTMtMTAuNjdhMTkuMzIgMTkuMzIgMCAwMDcuOCAxLjY0Yy40MSAwIC44MiAwIDEuMjItLjA2bDYgMzQuMDVhMTkuNCAxOS40IDAgMTAyMC44OCAzMC40MWwyOC4wOSAxMi41YTEzLjEzIDEzLjEzIDAgMDAuOTIgOC44MiAxNC4xMSAxNC4xMSAwIDAwMTEuNCA4LjIzQTE0IDE0IDAgMTAxMTQuNjMgMjU3bC0yNy40MS0xMi4yM2ExOS40MSAxOS40MSAwIDAwMi4yMi03LjE1bDM1LjY5LTguNzNhMTkuMzggMTkuMzggMCAwMDI5IDUuODlsMTMuMzYgMTEuNTNhMTQgMTQgMCAxMDEuNTctMi42NGwtMTIuNy0xMWExOS41MiAxOS41MiAwIDAwNC4yLTcuMTNsNTMuMDYgMi41NmExMy45NSAxMy45NSAwIDEwMTMuOTQtMTR6IiBmaWxsPSIjZmYwMDEyIiBkYXRhLW5hbWU9IkxheWVyIDEiLz48L2c+PC9zdmc+"
            width="12px"
            alt="cspr"
          />
        </span>
        <span className="text-xs text-gray-400">
          {formatNumber((Number(item.total_stake) / MOTE_VALUE) * casperPrice)}$
        </span>
      </div>,

      <div>
        <span className="text-sm text-gray-400">
          {item?.average_performance?.average_score?.toFixed(2)}%{" "}
        </span>

        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="h-2.5 rounded-full"
            style={{
              width: `${item.average_performance?.average_score}%`,
              backgroundColor: getPerfColor(
                item.average_performance?.average_score
              ),
            }}
          ></div>
        </div>
      </div>,
    ];
  });

  return (
    <div>
      <div className="flex overflow-y-hidden bg-white rounded-md shadow flex-nowrap">
        <Table
          totalItems={rows?.length || 1}
          isLoading={statusInfos.isFetching || validators.isFetching}
          rows={rows || []}
          header={headers}
        />
      </div>
    </div>
  );
};

export default ValidatorsList;
