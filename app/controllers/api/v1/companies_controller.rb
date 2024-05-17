# frozen_string_literal: true

module Api
  module V1
    class CompaniesController < ApplicationController
      def index
        @pagy, @records = pagy(filtered_companies, page: params[:page], items: params[:per_page])
        render json: {
          data: @records.as_json(include: :deals),
          pagy: pagy_metadata(@pagy)
        }
      end

      private

      def filtered_companies
        companies = Company.includes(:deals)
        companies = filter_companies(companies)
        companies.order(created_at: :desc)
      end

      def filter_companies(companies)
        companies = filter_by_company_name(companies)
        companies = filter_by_industry(companies)
        filter_by_employee_count(companies)
        # companies = filter_by_deal_amount(companies)
        companies
      end

      def filter_by_company_name(companies)
        return companies if params[:companyName].blank?

        companies.where('REGEXP_LIKE(name, ?)', params[:companyName])
      end

      def filter_by_industry(companies)
        return companies if params[:industry].blank?

        companies.where('REGEXP_LIKE(industry, ?)', params[:industry]) if params[:industry].present?
      end

      def filter_by_employee_count(companies)
        return companies if params[:minEmployee].blank?

        companies.where('employee_count >= ?', params[:minEmployee].to_i) if params[:minEmployee].present?
      end

      def filter_by_deal_amount(companies)
        return companies if params[:minimumDealAmount].blank?

        companies.group('companies.id').having('SUM(deals.amount) >= ?', params[:minimumDealAmount].to_f)
      end
    end
  end
end
